import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  redirectToZoomOAuthScreen,
  resetZoomDetailInstitutionSettings,
} from "@/src/client-functions/client-video-chat-providers/zoom";
import SettingsSection from "@/src/components/reusable/settings/settings-section";
import { useInstitutionSettings } from "../../zustand";
import ZoomAccountStatus from "./zoom-account-status";

export default function ZoomSettings() {
  const { t } = useTranslation("page");
  const { institutionSettings } = useInstitutionSettings();
  const [authorizing, setAuthorizing] = useState(false);

  const usingOwnAccount = institutionSettings.use_own_zoom_account === true;

  const handleAuthorize = async () => {
    if (usingOwnAccount) {
      await resetZoomDetailInstitutionSettings();
      return;
    }
    setAuthorizing(true);
    redirectToZoomOAuthScreen();
  };

  return (
    <SettingsSection
      title="organization_settings.zoom_title"
      subtitle="organization_settings.zoom_subtitle"
      footerButtonText={
        usingOwnAccount
          ? t("organization_settings.zoom_unlink_account")
          : t("organization_settings.zoom_link_account")
      }
      footerButtonDisabled={authorizing}
      footerButtonAction={handleAuthorize}
      footerButtonVariant={usingOwnAccount ? "destructive" : "cta"}
    >
      <ZoomAccountStatus
        authorizing={authorizing}
        usingOwnAccount={usingOwnAccount}
      />
    </SettingsSection>
  );
}
