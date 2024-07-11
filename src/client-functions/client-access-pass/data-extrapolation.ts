import type { TFunction } from "i18next";
import type { AccessPassStatusInfo } from "@/src/utils/stripe-types";
import { formatAccessPassDate } from "../client-paid-access-pass/utils";
import { getNameOfPass } from "./utils";

export const extractAccessPassListItem = (
  info: AccessPassStatusInfo,
  t: TFunction<"page", undefined>,
): { dateText: string; maxUserText: string | null } => {
  const { accessPass, currentMaxUsage } = info;
  const { maxUsers, endDate } = accessPass;

  const endDateFormatted = endDate ? formatAccessPassDate(endDate) : "";
  const fraction = currentMaxUsage + "/" + maxUsers;
  let dateText = "";
  let maxUserText;
  if (!info.status) {
    dateText = getNameOfPass(info.accessPass.stripePriceId);
    maxUserText = maxUsers ? ` ${maxUsers}` : null;
  } else {
    dateText =
      (accessPass.status === "canceled"
        ? t("access_pass.ended")
        : t("access_pass.ends")) +
      " " +
      endDateFormatted;
    maxUserText = maxUsers ? fraction : ` ${currentMaxUsage}`;
  }
  return { dateText, maxUserText };
};
