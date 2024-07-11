import { AlertTriangle } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import type Stripe from "stripe";
import { connectAccountHasRequirements } from "@/src/client-functions/client-stripe/data-extrapolation";
import SettingsSection from "@/src/components/reusable/settings/settings-section";
import WithToolTip from "@/src/components/reusable/with-tooltip";
import { useAccessPasses } from "./zustand";

export default function RecipientAccount() {
  const { accountInfo } = useAccessPasses();
  const { t } = useTranslation("page");
  const hasRequirement = connectAccountHasRequirements(
    accountInfo?.res as Stripe.Account,
  );
  return (
    <>
      <SettingsSection
        title="recipient_account_title"
        subtitle="recipient_account_description"
        footerButtonAction={async () => {
          window.open("https://dashboard.stripe.com/dashboard", "_blank");
        }}
        footerButtonText="organization_settings.manage_recipient_account"
        footerButtonVariant={"default"}
      >
        <div>
          <div className="flex gap-2 ">
            <div className="mt-1">
              <Image
                src="/images/stripe-logo.png"
                alt="Stripe Logo"
                width={16}
                height={16}
                className="rounded-sm"
              />
            </div>
            <div className="text-m font-semibold">{"Stripe"}</div>
          </div>
          <div className="text-sm text-muted-contrast">
            {accountInfo!.res.email}
            {hasRequirement && (
              <div className="block">
                <div className="inline-block">
                  <WithToolTip text={"connect_account_warning"}>
                    {
                      <div className="mt-2 flex gap-2  font-semibold text-contrast ">
                        {t("there_are_upcoming_requirements")}
                        <AlertTriangle className="h-4 w-4" />{" "}
                      </div>
                    }
                  </WithToolTip>
                </div>
              </div>
            )}
          </div>
        </div>
      </SettingsSection>
    </>
  );
}
