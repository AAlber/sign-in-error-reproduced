import { useQueryClient } from "@tanstack/react-query";
import { BrainCircuit } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { uploadInstitutionSettingsWithProcessToast } from "@/src/client-functions/client-institution-settings";
import { deleteMoodleIntegration } from "@/src/client-functions/client-moodle-integration";
import VideoChatIntegration from "@/src/client-functions/client-video-chat-providers/VideoChatIntegration";
import VideoChatIntegrations from "../../reusable/video-chat-integrations";
import { MOODLE_QUERY_KEY } from "../setting-containers/insti-settings-moodle/schema";
import { SettingId } from "../tabs";
import { useInstitutionSettings } from "../zustand";
import AddOn from "./add-on";

export default function Integrations() {
  const queryClient = useQueryClient();
  const { institutionSettings, updateInstitutionSettings } =
    useInstitutionSettings();
  const { t } = useTranslation("page");

  const bbb = new VideoChatIntegration({ id: "bbb" });
  const zoom = new VideoChatIntegration({ id: "zoom" });
  const videoChatProviders = [bbb, zoom];

  return (
    <div className="grid grid-cols-2 gap-4 p-4 max-xl:max-w-[700px] max-lg:max-w-[900px] xl:grid-cols-3 2xl:grid-cols-4">
      <AddOn
        icon={<BrainCircuit className="h-6 w-6 text-fuxam-pink-300" />}
        title="Artificial Intelligence"
        subtitle={t("organization_settings.add_ons_ai_subtitle")}
        active={institutionSettings.addon_artificial_intelligence}
        onToggle={(checked) => {
          updateInstitutionSettings({
            addon_artificial_intelligence: checked,
          });
          uploadInstitutionSettingsWithProcessToast({
            ...institutionSettings,
            addon_artificial_intelligence: checked,
          });
        }}
        settingsPage={SettingId.AI}
      />
      <VideoChatIntegrations providers={videoChatProviders} />
      <AddOn
        icon={
          <Image src="addons/moodle.svg" alt="Moodle" width={30} height={30} />
        }
        active={institutionSettings.integration_moodle}
        onToggle={async (checked) => {
          updateInstitutionSettings({ integration_moodle: checked });
          await uploadInstitutionSettingsWithProcessToast({
            ...institutionSettings,
            integration_moodle: checked,
          });
          if (!checked) {
            await deleteMoodleIntegration();
            queryClient.removeQueries(MOODLE_QUERY_KEY);
          }
        }}
        title="Moodle"
        subtitle={t("moodle.marketplace.add_on.subtitle")}
        settingsPage={SettingId.Moodle}
      />
    </div>
  );
}
