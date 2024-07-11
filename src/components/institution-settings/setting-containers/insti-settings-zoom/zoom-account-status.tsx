import React from "react";
import { useTranslation } from "react-i18next";
import Title from "@/src/components/reusable/title";
import { useInstitutionSettings } from "../../zustand";

const ZoomAccountStatus = ({ authorizing, usingOwnAccount }) => {
  const { t } = useTranslation("page");
  const { institutionSettings } = useInstitutionSettings();
  return (
    <>
      {authorizing ? (
        <>
          <p className="text-md font-bold text-muted-contrast">
            {t("organization_settings.zoom_new_page")}
          </p>
          <p className="mt-1 text-sm text-muted-contrast">
            {t("organization_settings.zoom_new_page2")}
          </p>
        </>
      ) : (
        <>
          <Title type="h6" text="Zoom account" className="mb-1" />
          <p className="text-sm text-muted-contrast">
            {usingOwnAccount
              ? t("organization_settings.zoom_own_account")
              : t("organization_settings.zoom_fuxam_account")}
          </p>
        </>
      )}

      {usingOwnAccount && (
        <>
          <Title
            type="h6"
            text="organization_settings.zoom_conneted_email"
            className="mb-1 mt-3"
          />
          <p className="text-sm text-muted-contrast">
            {institutionSettings.zoom_general_app_connected_email}
          </p>
        </>
      )}
    </>
  );
};

export default ZoomAccountStatus;
