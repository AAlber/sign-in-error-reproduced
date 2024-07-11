import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toastWaitForAccountCompletion } from "@/src/client-functions/client-paid-access-pass/utils";
import { removeQueryParam } from "@/src/client-functions/client-utils";
import SettingsSection from "@/src/components/reusable/settings/settings-section";
import AddAccessPassModal from "./add-access-pass-modal";
import RecipientAccount from "./recipient-account";
import AccessPassTable from "./table";
import TaxRateTable from "./tax-rates/table";
import { useAccessPasses } from "./zustand";

export default function AccessPasses() {
  const { accountInfo, setAccountCompletionInProgress } = useAccessPasses();
  const { t } = useTranslation("page");
  const accountExists = accountInfo?.id && accountInfo?.enabled;

  const router = useRouter();
  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.connectAccountCreated === "true") {
      toastWaitForAccountCompletion();
      setAccountCompletionInProgress(true);
    }
    removeQueryParam(router, "connectAccountCreated");
  }, [router.isReady]);

  return (
    <>
      {accountExists && <RecipientAccount />}
      <SettingsSection
        title={"organization_settings.access_pass_title"}
        subtitle={"organization_settings.access_pass_description"}
        footerButtonDisabled={false}
        noFooter
      >
        <AccessPassTable />
        <AddAccessPassModal />
      </SettingsSection>
      {accountExists && (
        <SettingsSection
          title={"organization_settings.tax_rates_title"}
          subtitle={"organization_settings.tax_rates_description"}
          footerButtonDisabled={false}
          noFooter
        >
          <TaxRateTable />
        </SettingsSection>
      )}
    </>
  );
}
