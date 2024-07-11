import SettingsSection from "@/src/components/reusable/settings/settings-section";
import TaxRateTable from "./table";

export default function AccessPasses() {
  return (
    <>
      <SettingsSection
        title={"organization_settings.manage_access_pass_title"}
        subtitle={"organization_settings.manage_access_pass_description"}
        footerButtonDisabled={false}
        noFooter
      >
        <TaxRateTable />
      </SettingsSection>
    </>
  );
}
