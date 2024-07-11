import { useTranslation } from "react-i18next";
import { deleteCloudflareDirectories } from "@/src/client-functions/client-cloudflare";
import { updateInstitutionGeneralInfo } from "@/src/client-functions/client-institution";
import confirmAction from "@/src/client-functions/client-options-modal";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import useUser from "@/src/zustand/user";

export default function DeleteLogoButton() {
  const { t } = useTranslation("page");
  const { user } = useUser();
  const { refreshUser } = useUser();

  return (
    <>
      {user.institution?.logo && (
        <Button
          variant={"destructive"}
          onClick={() => {
            confirmAction(
              async () => {
                const previousLogo = user.institution?.logo;
                await Promise.all([
                  updateInstitutionGeneralInfo({
                    logoLink: null,
                  }),
                  previousLogo &&
                    deleteCloudflareDirectories([
                      {
                        url: previousLogo,
                        isFolder: false,
                      },
                    ]),
                ]);
                refreshUser();
              },
              {
                title: "organization_settings.confirm_action_delete_logo",
                description:
                  "organization_settings.confirm_action_delete_logo_description",
                dangerousAction: true,
                actionName: "general.delete",
              },
            );
          }}
        >
          <span>{t("general.delete")}</span>
        </Button>
      )}
    </>
  );
}
