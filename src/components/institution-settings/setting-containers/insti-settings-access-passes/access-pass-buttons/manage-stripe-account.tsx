import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import type Stripe from "stripe";
import { connectAccountHasRequirements } from "@/src/client-functions/client-stripe/data-extrapolation";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import WithToolTip from "@/src/components/reusable/with-tooltip";
import { useAccessPasses } from "../zustand";

export default function ManageStripeAccountButton() {
  const { t } = useTranslation("page");
  const { accountInfo } = useAccessPasses();
  return (
    <div className="flex gap-2">
      <Button
        type="button"
        onClick={() => {
          window.open("https://dashboard.stripe.com/dashboard", "_blank");
        }}
      >
        {t("organization_settings.manage_recipient_account")} {"  "}
        {connectAccountHasRequirements(accountInfo?.res as Stripe.Account) && (
          <WithToolTip text={"connect_account_warning"}>
            <div className=" pl-2">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </WithToolTip>
        )}
      </Button>
    </div>
  );
}
