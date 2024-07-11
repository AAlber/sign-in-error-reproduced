import dayjs from "dayjs";
import type { CreditEditData } from "../components/admin-dashboard/table/institution-overview-sheet/edit-institution-credit";
import { useAdminDash } from "../components/admin-dashboard/table/zustand";
import { useDiscountCreator } from "../components/admin-dashboard/top-right-menu/common-form/main-subscription-discount/zustand";
import {
  useCreateInstitutionPopover,
  useCreatePaymentLink,
} from "../components/admin-dashboard/top-right-menu/zustand";
import { toast } from "../components/reusable/toaster/toast";
import type { AdminDashCreateInstitutionData } from "../pages/api/admin-dashboard/admin-dash-create-institution";
import type { DeleteInstitutionCouponData } from "../pages/api/admin-dashboard/delete-institution-coupon";
import type { AdminDashExtendInstitutionSubscriptionData } from "../pages/api/admin-dashboard/extend-institution-subscription";
import type { AdminDashInstantCancelSubscription } from "../pages/api/admin-dashboard/instant-cancel-subscription";
import api from "../pages/api/api";
import type { CreateInstitutionData } from "../pages/api/institutions/create-institution";
import type {
  AdminDashInstitution,
  CouponCreateData,
} from "../utils/stripe-types";
import confirmAction from "./client-options-modal";

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
    toast.error("Error", { description: res.message });
    return [];
  }
  return await response.json();
};

export const extendSubscriptionOfInstitution = async (
  data: AdminDashExtendInstitutionSubscriptionData,
) => {
  const response = await fetch(api.extendSubscriptionOfInstitution, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const res = await response.json();
    toast.error("Error", { description: res.message });
    return;
  } else {
    console.log("data", data);
    toast.success("Successfully updated trial end", {
      description:
        "Institution:" +
        data.institutionName +
        " -- " +
        dayjs(data.cancelDate * 1000).format("DD.MM.YYYY"),
      duration: 5000,
    });
  }
  return await response.json();
};

export const adminDashCreateInstitution = async (
  data: AdminDashCreateInstitutionData,
) => {
  const response = await fetch(api.adminDashCreateInstitution, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const res = await response.json();
    toast.error("Error", { description: res.message });
    return;
  } else {
    toast.success("Success", {
      description: "Institution successfully created",
    });
  }
  return await response.json();
};

export const instantCancelSubscription = async (
  data: AdminDashInstantCancelSubscription,
): Promise<AdminDashInstitution[]> => {
  const response = await fetch(api.instantCancelSubscription, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const res = await response.json();
    toast.error("Error", { description: res.message });
  }
  return await response.json();
};

export const confirmInstantCancelSubscription = async (
  data: AdminDashInstantCancelSubscription,
  institutionName: string,
) => {
  confirmAction(
    async () => {
      const { setRefresh, refresh } = useAdminDash.getState();
      await instantCancelSubscription(data);
      setRefresh(refresh + 1);
    },
    {
      actionName: "Instant Cancel Subscription",
      description: `Are you sure you want to instant cancel this subscription  \"${institutionName}\"?`,
      dangerousAction: true,
      allowCancel: true,
      title: "Instant Cancel Subscription",
    },
  );
};

export const adminDashDeleteInstitutions = async (institutionId?: string) => {
  const {
    adminDashInstitutions,
    setAdminDashInstitutions,
    selectedInstitutionIds,
    adminDashPassword,
  } = useAdminDash.getState();
  const institutionsToDelete = institutionId
    ? [institutionId]
    : [...selectedInstitutionIds];
  const institutionNames = institutionsToDelete.map((id) => {
    const institution = adminDashInstitutions.find(
      (institution) => institution.institution.id === id,
    );
    return institution?.institution.name;
  });
  confirmAction(
    () => {
      toast.transaction({
        transaction: () =>
          fetch(api.adminDashDeleteInstitution, {
            method: "POST",
            body: JSON.stringify({
              institutionIds: institutionId
                ? [institutionId]
                : [...selectedInstitutionIds],
              adminDashPassword,
            }),
          }),
        errorMessage: "toast_delete_organization_error",
        processMessage: "toast_delete_organization_process",
        successMessage: "toast_delete_organization_success",
        onSuccess: () => {
          const copy = [...adminDashInstitutions];
          setAdminDashInstitutions(
            copy.filter(
              (institution) =>
                !institutionsToDelete.includes(institution.institution.id),
            ),
          );
        },
      });
    },
    {
      actionName: "Delete",
      description:
        `Are you sure you want to delete these institutions:` +
        institutionNames.map((name) => `\"${name}\"`).join(", ") +
        "?",
      dangerousAction: true,
      requiredConfirmationCode: true,
      confirmationCode: institutionNames.join(", "),
      allowCancel: true,
      title: "Delete Institutions?",
    },
  );
};

// export const adminDashUploadLogo = async ({
//   institutionName,
// }: {
//   institutionName: string | undefined;
// }) => {
//   const { logo } = useInstitutionOnboarding.getState();
//   const res = await serverUploadToFirebase(
//     logo,
//     `logos//institutions/${institutionName}/Logo/logo.webp`,
//     "image/png",
//     true,
//   );
//   return res;
// };

export const encryptPaymentSettings = async (data: {
  paymentSettings: CreateInstitutionData;
  adminDashPassword: string;
}) => {
  const response = await fetch(api.adminDashEncryptPaymentSettings, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const res = await response.json();
    toast.error("Error", { description: res.message });
  }
  return response.json();
};

export const sendAdminDashAdminInvite = async (data: {
  adminDashPassword: string;
  email: string;
  institutionId: string;
}) => {
  const response = await fetch(api.sendAdminDashAdminInvite, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const res = await response.json();
    toast.error("Error", { description: res.message });
  } else {
    toast.success("Success", {
      description: "Admin successfully invited",
    });
  }
  return await response.json();
};

export const updateInstitutionCredits = async (
  data: CreditEditData & {
    institutionId: string;
    onSuccess?: (data: any) => void;
  },
) => {
  const { adminDashPassword } = useAdminDash.getState();
  const response = await fetch(api.adminDashUpdateInstitutionCredits, {
    method: "POST",
    body: JSON.stringify({ ...data, adminDashPassword }),
  });
  if (!response.ok) {
    const res = await response.json();
    toast.error("Error", { description: res.message });
    return undefined;
  } else {
    if (data.onSuccess) {
      toast.success("Success", {
        description: "Credits successfully updated",
      });
      switch (true) {
        case data.aiCredits !== undefined:
          return data.onSuccess(data.aiCredits);
        case data.gbPerUser !== undefined:
          return data.onSuccess(data.gbPerUser);
        case data.baseStorageGb !== undefined:
          return data.onSuccess(data.baseStorageGb);
        case data.accessPassDiscount !== undefined:
          return data.onSuccess(data.accessPassDiscount);
        case data.mainSubCouponData !== undefined:
          return data.onSuccess(data.mainSubCouponData);
      }
    }
  }
};

export const getMainSubCouponData = (
  creatorType: "create-organization" | "payment-link",
) => {
  const { discountEnabled: createLinkDiscountEnabled } =
    useCreatePaymentLink.getState();
  const { discountEnabled: createInstitutionDiscountEnabled } =
    useCreateInstitutionPopover.getState();
  const discountEnabled =
    creatorType === "create-organization"
      ? createInstitutionDiscountEnabled
      : createLinkDiscountEnabled;
  const { durationInMonths, type, amountOff, percentOff } =
    useDiscountCreator.getState();
  const mainSubCouponData: CouponCreateData = {
    duration: type,
    duration_in_months: durationInMonths,
    amount_off: amountOff ? amountOff * 100 : undefined,
    percent_off: percentOff,
  };
  if (!(amountOff || percentOff) && discountEnabled) {
    toast.error("Error", { description: "Please provide a discount amount" });
    return;
  }
  return discountEnabled ? mainSubCouponData : undefined;
};

export const deleteInstitutionCoupon = async (
  data: Pick<DeleteInstitutionCouponData, "institutionId" | "type">,
) => {
  const { adminDashPassword } = useAdminDash.getState();
  const response = await fetch(api.adminDashDeleteInstitutionCoupon, {
    method: "POST",
    body: JSON.stringify({ ...data, adminDashPassword }),
  });
  if (!response.ok) {
    const res = await response.json();
    toast.error("Error", { description: res.message });
    return;
  } else {
    toast.success("Success", {
      description: "Coupon successfully deleted",
    });
  }
};
