import { useInstitutionSettings } from "@/src/components/institution-settings/zustand";
import type { VideoChatProviderId } from "@/src/types/video-chat-provider-integration.types";
import { generateBigBlueButtonLink } from "./big-blue-button";
import { generateZoomLink } from "./zoom";

export async function generateMeetingLink(
  provider: VideoChatProviderId,
  layerIds: string[],
  title: string,
  duration: number,
) {
  switch (provider) {
    case "bbb":
      return await generateBigBlueButtonLink(layerIds, title, duration);
    case "zoom":
      return await generateZoomLink(layerIds, title, duration);
    default:
      return null;
  }
}

export function shouldRenderVideoChatProvider(providerId: VideoChatProviderId) {
  const { institutionSettings } = useInstitutionSettings.getState();
  const provider = institutionSettings.videoChatProviders.find(
    (provider) => provider.id === providerId,
  );
  if (!provider) {
    return false;
  }
  switch (providerId) {
    case "bbb":
    case "zoom":
      return provider.active;
    default:
      return false;
  }
}
