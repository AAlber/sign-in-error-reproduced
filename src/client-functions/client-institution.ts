import * as Sentry from "@sentry/browser";
import type { NextRouter } from "next/router";
import useThemeStore from "../components/dashboard/navigation/primary-sidebar/user-menu/theme-switcher/zustand";
import useInstitutionOnboarding from "../components/institution-onboarding/zustand";
import { usePlanSelector } from "../components/institution-settings/setting-containers/insti-settings-billing/plan-selector/zustand";
import { toast } from "../components/reusable/toaster/toast";
import api from "../pages/api/api";
import type { CreateInstitutionData } from "../pages/api/institutions/create-institution";
import type { UpdateInstitutionGeneralInfoData } from "../types/server/institution.types";
import type { AdminDashInstitution } from "../utils/stripe-types";
import { retry } from "../utils/utils";
import useUser from "../zustand/user";
import type { SupportPackages } from "./client-stripe/price-id-manager";
import {
  getPricingInterval,
  getPricingModel,
} from "./client-stripe/price-id-manager";
import { removeQueryParam } from "./client-utils";

export const deleteInstitutionData = async (signOut: () => void) => {
  return toast.transaction({
    transaction: () =>
      fetch(api.deleteInstitution, {
        method: "POST",
      }),
    errorMessage: "toast_delete_organization_error",
    processMessage: "toast_delete_organization_process",
    successMessage: "toast_delete_organization_success",
    onSuccess: () => {
      signOut();
    },
  });
};

export async function updateInstitutionGeneralInfo(
  data: UpdateInstitutionGeneralInfoData,
) {
  await updateInstitutionNameLogoZustand(data);

  const response = await fetch(api.updateInstitution, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return await response.json();
}

const updateInstitutionNameLogoZustand = async ({
  logoLink,
  name,
}: UpdateInstitutionGeneralInfoData) => {
  const { setUser, user } = useUser.getState();
  const userCopy = { ...user };
  if (userCopy.institution) {
    userCopy.institution = {
      ...userCopy.institution,
      ...(name ? { name } : {}),
      ...(logoLink ? { logo: logoLink } : {}),
    };
  }
  setUser(userCopy);
};

const localRetry = async (fn: () => Promise<Response>) => {
  return await retry(
    async () => {
      return await fn();
    },
    {
      retries: 5,
      retryIntervalMs: 1500,
    },
  );
};

export async function createInstitutionAndGetCheckoutLink({
  name,
  logoLink,
  standardSubscriptionItem,
  supportPackagePriceId,
  instiTheme,
  language,
}: CreateInstitutionData) {
  const response = await localRetry(async () =>
    fetch(api.createInstitution, {
      method: "POST",
      body: JSON.stringify({
        name,
        logoLink,
        supportPackagePriceId:
          supportPackagePriceId === "none" ? undefined : supportPackagePriceId,
        standardSubscriptionItem,
        instiTheme,
        language,
      }),
    }),
  );
  return await response.json();
}

export const createInstitutionWithPaymentSettings = async (
  paymentSettings: string,
  router: NextRouter,
) => {
  const res = await fetch(api.createInstitution, {
    method: "POST",
    body: JSON.stringify({
      paymentSettings,
    }),
  });
  if (res.ok) router.push(await res.json());
};

export async function completeInstitutionOnboarding(institutionId: string) {
  const res = await fetch(api.completeInstitutionOnboarding, {
    method: "POST",
    body: JSON.stringify({
      institutionId,
    }),
  });
  if (res.ok) {
    window.location.assign(`/?page=STRUCTURE&actions=open:welcome-learn-menu`);
  } else {
    toast.error("Error", {
      description: "Couldn't complete onboarding",
      duration: 5000,
    });
  }
}

export async function createTrialSubscription() {
  const { name, logoLink, language } = useInstitutionOnboarding.getState();
  const { instiTheme } = useThemeStore.getState();
  const res = await fetch(api.createTrialSubscription, {
    method: "POST",
    body: JSON.stringify({
      name,
      logo: logoLink,
      theme: instiTheme,
      language,
    }),
  });
  if (res.ok) {
    window.location.assign(
      `/?page=STRUCTURE&actions=open:welcome-learn-menu,refresh-user`,
    );
  } else {
    toast.error("Error", {
      description: "couldnt_create_trial_subscription",
      duration: 5000,
    });
  }
}

export async function cancelInstitutionOnboarding(
  institutionId: string,
  previousConfig: string,
) {
  window.location.assign(
    "/institution-onboarding/process?previousConfig=" + previousConfig,
  );
}

export const refillOnboardingData = async (router: NextRouter) => {
  Sentry.addBreadcrumb({ message: "refillOnBoardingData - onboarding step 1" });

  const { setLogoLink } = useInstitutionOnboarding.getState();
  const { setInstiTheme } = useThemeStore.getState();
  const { setBillingPeriod, setUserAmount, setSupportPackage } =
    usePlanSelector.getState();
  const { setName, setLanguage, setStep } = useInstitutionOnboarding.getState();
  const previousConfig: CreateInstitutionData = JSON.parse(
    router.query.previousConfig as string,
  );
  if (previousConfig) {
    fetch(api.deleteEmptyInstitution, {
      method: "POST",
      body: JSON.stringify({
        institutionId: router.query.deleteInstitutionId,
      }),
    });
    const billingPeriod = getPricingInterval(
      previousConfig.standardSubscriptionItem.priceId,
    );
    if (!billingPeriod) throw new Error("Billing period not found");
    setUserAmount(previousConfig.standardSubscriptionItem.quantity);
    setInstiTheme(previousConfig.instiTheme);
    setBillingPeriod(billingPeriod);
    setLogoLink(previousConfig.logoLink);
    setName(decodeURIComponent(previousConfig.name));
    setSupportPackage(
      (previousConfig.supportPackagePriceId || "none") as SupportPackages,
    );
    setLanguage(previousConfig.language);
    removeQueryParam(router, ["previousConfig", "deleteInstitutionId"]);
    setStep(2);
  }
};

// Main function to handle institution creation
export async function createInstitution({ router }) {
  const { name, logoLink, language } = useInstitutionOnboarding.getState();
  const { userAmount, billingPeriod, supportPackage } =
    usePlanSelector.getState();
  const { instiTheme } = useThemeStore.getState();
  const response = await fetch(api.createInstitution, {
    method: "POST",
    body: JSON.stringify({
      name,
      logoLink,
      supportPackagePriceId:
        supportPackage === "none" ? undefined : supportPackage,
      standardSubscriptionItem: {
        quantity: userAmount,
        priceId: getPricingModel(userAmount, billingPeriod === "monthly"),
      },
      instiTheme,
      language,
      gbPerUser: 3, //TODO: get this from user input
    }),
  });
  if (response.ok) router.push(await response.json());
}

export const getAdminDashInstitutions = async (
  adminDashPassword: string,
): Promise<AdminDashInstitution[]> => {
  const response = await fetch(
    api.adminDashGetInstitutions + "?adminDashPassword=" + adminDashPassword,
    {
      method: "GET",
    },
  );
  if (!response.ok) {
    const res = await response.json();
    toast.error("Error", {
      description: res.message,
    });
    return [];
  }
  return await response.json();
};
