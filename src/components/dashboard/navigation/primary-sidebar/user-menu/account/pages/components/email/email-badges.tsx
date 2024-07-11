import React from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/src/components/reusable/shadcn-ui/badge";

export const PrimaryEmailBadge = () => {
  const { t } = useTranslation("page");
  return (
    <Badge className="rounded-lg border-none bg-positive/70 px-2 py-1 font-semibold hover:bg-positive/70">
      {t("account_modal.email_overview_primary_badge")}
    </Badge>
  );
};

export const UnverifiedEmailBadge = () => {
  const { t } = useTranslation("page");
  return (
    <Badge
      variant="destructive"
      className="mr-2 rounded-lg border-none  px-2 py-1 font-semibold"
    >
      {t("account_modal.email_overview_unverified_badge")}
    </Badge>
  );
};
