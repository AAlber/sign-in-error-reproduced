import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { uploadInstitutionSettings } from "@/src/client-functions/client-institution-settings";
import { getUser } from "@/src/client-functions/client-user-management";
import UserDropdownView from "@/src/components/popups/user-dropdown-view";
import Skeleton from "@/src/components/skeleton";
import UserDefaultImage from "@/src/components/user-default-image";
import useUser from "@/src/zustand/user";
import SettingsSection from "../../reusable/settings/settings-section";
import { useInstitutionSettings } from "../zustand";

export default function SupportContactSelect() {
  const { user: data } = useUser();
  const [user, setUser] = useState<any>(null);
  const [changed, setChanged] = useState(false);
  const [loading, setLoading] = useState(true);
  const { institutionSettings, updateInstitutionSettings } =
    useInstitutionSettings();

  const { t } = useTranslation("page");

  useEffect(() => {
    setLoading(true);
    if (!institutionSettings.support_contact_userid) return setLoading(false);
    getUser(institutionSettings.support_contact_userid).then((user) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  return (
    <SettingsSection
      title="organization_settings.support_contact_title"
      subtitle="organization_settings.support_contact_subtitle"
      footerButtonText="general.save"
      footerButtonDisabled={!changed}
      footerButtonAction={async () => {
        await uploadInstitutionSettings(institutionSettings);
        setChanged(false);
      }}
    >
      <div className="col-span-full mb-5 flex flex-col">
        <div className="block text-sm font-medium leading-6 text-contrast">
          {t("organization_settings.support_contact_text")}
        </div>
        <UserDropdownView
          layerId={data.currentInstitutionId}
          onUserSelect={(user) => {
            setUser(user);
            setChanged(true);
            updateInstitutionSettings({ support_contact_userid: user.id });
          }}
        >
          <div
            className={
              "relative mt-4 flex cursor-pointer items-center justify-start rounded-md border border-border hover:bg-foreground "
            }
          >
            {!loading && user && (
              <XIcon
                className="absolute right-4 h-4 w-4 text-muted-contrast"
                onClick={() => {
                  setUser(null);
                  setChanged(true);
                  updateInstitutionSettings({ support_contact_userid: "" });
                }}
              />
            )}
            {loading && (
              <div className="h-14 w-full">
                <Skeleton />
              </div>
            )}
            {!loading && user === null && (
              <div className="px-4 py-3 text-sm text-muted-contrast">
                {t("organization_settings.support_contact_placeholder")}
              </div>
            )}
            {!loading && user !== null && (
              <div className="flex items-center justify-start px-4 py-3">
                <UserDefaultImage user={user} dimensions={"h-8 w-8"} />
                <div className="ml-4">
                  <div className="flex items-center gap-2 text-sm text-contrast">
                    {user.name}
                  </div>
                  <div className="text-xs text-muted-contrast">
                    {user.email}
                  </div>
                </div>
              </div>
            )}
          </div>
        </UserDropdownView>
      </div>
    </SettingsSection>
  );
}
