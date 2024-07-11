import SettingsSection from "../../reusable/settings/settings-section";

export default function BetaFeatures() {
  return (
    <SettingsSection
      title="organization_settings.navbar_marketplace_beta_features"
      subtitle="organization_settings.navbar_marketplace_beta_features_description"
      footerButtonText="general.save"
      footerButtonAction={async () => {
        console.log("Saved");
      }}
    >
      <></>
    </SettingsSection>
  );
}
