import { useInstitutionSettings } from "@/src/components/institution-settings/zustand";
import type { VideoChatProviderId } from "@/src/types/video-chat-provider-integration.types";
import { defaultVideoChatProviderSettings } from "@/src/types/video-chat-provider-integration.types";
import useUser from "@/src/zustand/user";
import { uploadInstitutionSettingsWithProcessToast } from "../client-institution-settings";

class VideoChatIntegration {
  active = false;
  iconAlt: string;
  iconSrc: string;
  id: VideoChatProviderId;
  isBeta: boolean;
  subtitle: string;
  settingsPage?: number;
  title: string;

  constructor({ id }: { id: VideoChatProviderId }) {
    const item = defaultVideoChatProviderSettings.find((p) => p.id === id);
    this.iconAlt = item?.iconAlt || "";
    this.iconSrc = item?.iconSrc || "";
    this.id = item?.id || "";
    this.isBeta = item?.isBeta || false;
    this.subtitle = item?.subtitle || "";
    this.settingsPage = item?.settingsPage;
    this.title = item?.title || "";
    if (item) {
      this.initializeActiveState();
    }
  }

  initializeActiveState() {
    const { institutionSettings } = useInstitutionSettings.getState();
    const { user } = useUser.getState();
    const settings = user.institution?.institutionSettings;
    const providers =
      institutionSettings?.videoChatProviders || settings?.videoChatProviders;
    const key =
      providers.find((provider) => provider.id === this.id)?.active || false;
    this.active = key;
  }

  toggleActivation(checked: boolean) {
    const { updateInstitutionSettings, institutionSettings } =
      useInstitutionSettings.getState();

    updateInstitutionSettings({
      videoChatProviders: institutionSettings.videoChatProviders.map(
        (provider) =>
          provider.id === this.id
            ? { active: checked, id: provider.id }
            : provider,
      ),
    });
    uploadInstitutionSettingsWithProcessToast({
      ...institutionSettings,
      videoChatProviders: institutionSettings.videoChatProviders.map(
        (provider) =>
          provider.id === this.id
            ? { active: checked, id: provider.id }
            : provider,
      ),
    });
  }
}

export default VideoChatIntegration;
