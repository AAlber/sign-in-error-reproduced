import { useTranslation } from "react-i18next";
import { deleteInstitutionData } from "@/src/client-functions/client-institution";
import confirmAction from "@/src/client-functions/client-options-modal";
import useAuthSignout from "@/src/client-functions/client-signout";
import { downloadFileFromUrl } from "@/src/client-functions/client-utils";
import Box from "@/src/components/reusable/box";
import SettingsSection from "@/src/components/reusable/settings/settings-section";
import { Button } from "../../reusable/shadcn-ui/button";

export default function DangerZone() {
  const { signOut } = useAuthSignout("insti-settings-danger-zone");
  const { t } = useTranslation("page");

  return (
    <>
      <SettingsSection
        title="organization_settings.data_privacy_title"
        subtitle="organization_settings.data_privacy_subtitle"
        noFooter={true}
      >
        <Box smallPadding>
          <div className="flex items-center justify-between gap-5 px-2 py-3 text-sm text-contrast">
            <div className="flex flex-col gap-0.5">
              fuxam-data-privacy-jan-2024.pdf
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={"default"}
                onClick={() => {
                  downloadFileFromUrl(
                    "fuxam-data-privacy-jan-2024.pdf",
                    "/files/fuxam-data-privacy-jan-2024.pdf",
                    true,
                  );
                }}
              >
                {t("general.view")}
              </Button>
              <Button
                variant={"default"}
                onClick={() => {
                  downloadFileFromUrl(
                    "fuxam-data-privacy-jan-2024.pdf",
                    "/files/fuxam-data-privacy-jan-2024.pdf",
                  );
                }}
              >
                {t("download")}
              </Button>
            </div>
          </div>
        </Box>
      </SettingsSection>
      <SettingsSection
        title="organization_settings.danger_zone_title"
        subtitle="organization_settings.danger_zone_subtitle"
        noFooter={true}
      >
        <Box smallPadding>
          <div className="flex items-center justify-between gap-5 px-2 py-3 text-sm text-contrast">
            <div className="flex flex-col gap-0.5">
              {t("organization_settings.danger_zone_text")}
              <p className="text-xs text-muted-contrast">
                {t("organization_settings.danger_zone_subtext")}
              </p>
            </div>
            <Button
              onClick={() => {
                confirmAction(() => deleteInstitutionData(signOut), {
                  title:
                    "organization_settings.confirm_action_delete_organization",
                  description:
                    "organization_settings.confirm_action_delete_organization_description",
                  actionName: "general.delete",
                  dangerousAction: true,
                  requiredConfirmationCode: true,
                  confirmationCode: "DELETE INSTITUTION",
                });
              }}
              variant={"destructive"}
            >
              {t("general.delete")}
            </Button>
          </div>
        </Box>
      </SettingsSection>
    </>
  );
}
