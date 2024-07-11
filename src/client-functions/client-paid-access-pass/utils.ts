import dayjs from "dayjs";
import type { ChangeEvent } from "react";
import type Stripe from "stripe";
import { toast } from "@/src/components/reusable/toaster/toast";
import type { LayerUserHasAccessTo } from "@/src/types/user.types";

type AccessPassCreatorOrEditorData = {
  name: string;
  layer?: LayerUserHasAccessTo;
  taxRate?: Stripe.TaxRate;
  isPaid: boolean;
  maxUsers?: number;
  withMemberLimit: boolean;
  description: string;
  priceForUser?: number | null;
};

export const isCreateOrUpdateAccessPassEnabled = (
  mode: "create" | "update",
  data: AccessPassCreatorOrEditorData,
) => {
  const {
    name,
    layer,
    taxRate,
    isPaid,
    maxUsers,
    withMemberLimit,
    description,
    priceForUser,
  } = data;
  if (!layer && mode === "create") {
    missingLayerToast();
    return false;
  }
  if (withMemberLimit) {
    if (!maxUsers || maxUsers < 1) {
      zeroMemberLimitToast();
      return false;
    }
  }
  if (isPaid) {
    if (name === "") {
      missingNameToast();
      return false;
    }
    if (!taxRate) {
      missingTaxRate();
      return false;
    }
    if (!priceForUser) {
      missingPriceToast();
      return false;
    }
    if (description === "") {
      missingDescriptionToast();
      return false;
    }
  }
  return true;
};

export const priceInputValidation = (e: ChangeEvent<HTMLInputElement>) => {
  let value = e.target.value;

  // Remove leading dot
  if (value.startsWith(".")) {
    value = "0.";
  }

  // Using a regular expression to check if the input has only numbers and dots
  if (!/^[0-9.]*$/.test(value)) {
    // If not valid, show an error and remove the invalid character
    value = value.replace(/[^0-9.]/g, "");
  }

  // Ensure there is at most one dot and not more than two digits after the dot
  let parts = value.split(".");
  if (parts.length > 2) {
    parts = [parts[0]!, parts.slice(1).join("")];
  }

  // Limit digits before the dot to four
  if (parts[0]!.length > 4) {
    parts[0] = parts[0]!.substring(0, 4);
  }

  // Limit digits after the dot to two
  if (parts[1] && parts[1].length > 2) {
    parts[1] = parts[1].substring(0, 2);
  }
  value = parts.join(".");
  return value;
};

export const formatAccessPassDate = (date: number) => {
  const newDate = new Date(date * 1000);
  return dayjs(newDate).format("DD. MMM");
};

export const missingTaxRate = () => {
  toast.warning("paid_access_pass.error_2_title", {
    description: "paid_access_pass.error_2_description",
  });
};

export const missingLayerToast = () => {
  toast.warning("paid_access_pass.error_3_title", {
    description: "paid_access_pass.error_3_description",
  });
};

export const zeroMemberLimitToast = () => {
  toast.warning("paid_access_pass.error_4_title", {
    description: "paid_access_pass.error_4_description",
  });
};

export const missingDescriptionToast = () => {
  toast.warning("paid_access_pass.error_5_title", {
    description: "paid_access_pass.error_5_description",
  });
};
export const missingNameToast = () => {
  toast.warning("paid_access_pass.error_7_title", {
    description: "paid_access_pass.error_7_description",
  });
};

export function toastWaitForAccountCompletion() {
  toast.loading("connect.wait_for_completion_title", {
    description: "connect.wait_for_completion_description",
    duration: 10000,
  });
}

export const missingPriceToast = () => {
  toast.warning("paid_access_pass.error_6_title", {
    description: "paid_access_pass.error_6_description",
  });
};
