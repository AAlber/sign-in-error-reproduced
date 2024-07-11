import type Stripe from "stripe";
import { useNavigation } from "@/src/components/dashboard/navigation/zustand";
import { SettingId } from "@/src/components/institution-settings/tabs";
import { toast } from "@/src/components/reusable/toaster/toast";
import useUser from "@/src/zustand/user";
import confirmAction from "../client-options-modal";
import { hasRolesWithAccess } from "../client-user-management";
import { checkInstitutionSubscriptionStatus } from ".";
import { isTestInstitution } from "./data-extrapolation";
import { isSubscriptionCancellingInNext3Days } from "./utils";

const warnUserAboutSubscription = async (
  status: Stripe.Subscription.Status,
) => {
  const { title, description } = getNotSubscribedModalText(status);
  confirmAction(() => goToBillingPage(), {
    title: title,
    description: description,
    allowCancel: false,
    actionName: "billing_page.alerts.action_name",
  });
};

export const goToBillingPage = () => {
  const { setPage, navigateToTab } = useNavigation.getState();
  if (!isOnIndexPage()) {
    window.location.assign("/");
  }

  setPage("ORGANIZATION_SETTINGS");
  navigateToTab(SettingId.Billing.toString());
};

export const toastUnfilledFields = () => {
  toast.warning("billing_page.alerts.missing_information_title", {
    description: "billing_page.alerts.missing_information_description",
    duration: 3000,
  });
};

const getNotSubscribedModalText = (status: string) => {
  switch (status) {
    case "past_due":
      return {
        title: "billing_page.alerts.payment_past_due_title",
        description: "billing_page.alerts.payment_past_due_description",
      };
    case "unpaid":
      return {
        title: "billing_page.alerts.unpaid_title",
        description: "billing_page.alerts.unpaid_description",
      };
    case "canceled":
      return {
        title: "billing_page.alerts.canceled_title",
        description: "billing_page.alerts.canceled_description",
      };
    default:
      return {
        title: "billing_page.alerts.no_active_subscription_title",
        description: "billing_page.alerts.no_active_subscription_description",
      };
  }
};
export const toastPaymentSubmissionError = () => {
  toast.warning("billing_page.alerts.payment_submission_error_title", {
    description: "billing_page.alerts.payment_submission_error_description",
  });
};

export const toastUserAmountTooLow = () => {
  toast.warning("billing_page.alerts.toast_slider_value_too_low_title", {
    icon: "🤚",
    duration: 5000,
    description: `billing_page.alerts.toast_slider_value_too_low_description`,
  });
};

export const toastGetSpecialOffer = () => {
  toast.success("toast.billing_big_organization", {
    icon: "😍",
    description: "toast.billing_big_organization_description",
    align: "vertical",
    action: {
      label: "contact_sales",
      onClick: () => {
        window.open(
          "https://meetings-eu1.hubspot.com/meetings/jschroeder/julian-schroder-clone",
          "_blank",
        );
      },
    },
  });
};

export const thankUserForPayment = () => {
  toast.success("toast.billing_welcome", {
    duration: 15000,
    description: "toast.billing_welcome_description",
    icon: "🎉",
  });
};

export const tellUserPaymentIsProcessing = () => {
  toast.loading("toast.billing_payment_processing", {
    duration: 15000,
    description: "toast.billing_payment_processing_description",
  });
};

export const tellUserAllPaymentsFailedAndRedirectToInvoices = () => {
  toast.error("toast.billing_payment_failed", {
    duration: 15000,
    description: "toast.billing_payment_failed_description",
    ...goToBillingAction(),
  });
};

export const goToBillingAction = () => {
  return (
    isOnIndexPage() && {
      action: {
        label: "organization_settings.navbar_payment",
        onClick: () => {
          goToBillingPage();
        },
      },
    }
  );
};
export const tellUserSubscriptionIsCancelled = () => {
  toast.warning("toast.billing_payment_cancelled", {
    duration: 15000,
    align: "vertical",
    description: "toast.billing_payment_cancelled_description",
    ...goToBillingAction(),
  });
};

export const isOnIndexPage = () => {
  return window.location.pathname === "/";
};

export const toastNoSubscription = () => {
  toast.warning("toast.billing_not_have_subscription", {
    description: "toast.billing_not_have_subscription_description",
    icon: "🤚",
    ...goToBillingAction(),
  });
};

export const isLocalhost =
  process.env.NEXT_PUBLIC_SERVER_URL === "http://localhost:3000/";

export const checkSubscriptionAndOverage = async () => {
  const { currentInstitutionId: currentInstitution } = useUser.getState().user;
  if (isLocalhost) return;
  hasRolesWithAccess({
    layerIds: [currentInstitution],
    rolesWithAccess: ["admin"],
  }).then(async (isAdmin) => {
    if (!isAdmin) return;
    const { active, status, subscription } =
      await checkInstitutionSubscriptionStatus();
    if (status === "canceled" && isTestInstitution(subscription)) {
      return tellUserTestSubscriptionIsOver();
    } else if (status === "unpaid") {
      tellUserAllPaymentsFailedAndRedirectToInvoices();
    } else if (status === "canceled") {
      tellUserSubscriptionIsCancelled();
    } else if ((!active || !status) && isAdmin) {
      warnUserAboutSubscription(status);
    } else if (isAdmin && active === true) {
      if (isSubscriptionCancellingInNext3Days(subscription)) {
        tellUserSubscriptionWillCancel();
      }
    }
  });
};

export const tellUserTestSubscriptionIsOver = () => {
  confirmAction(() => goToBillingPage(), {
    title: "test-org-cancelled-title",
    description: "test-org-cancelled-description",
    allowCancel: false,
    actionName: "billing_page.alerts.action_name",
  });
};

export const tellUserSubscriptionWillCancel = () => {
  toast.info("subscription_cancels_soon_title", {
    description: "subscription_cancels_soon_description",
    duration: 7000,
    align: "vertical",
    ...goToBillingAction(),
  });
};

export const tellUserAboutAddingBillingInfoFail = (e: any) => {
  toast.error("toast.billing_failed_update", {
    description: (e as Error).message,
  });
};
