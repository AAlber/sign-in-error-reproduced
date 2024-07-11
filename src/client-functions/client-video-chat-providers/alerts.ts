import { useInstitutionSettings } from "@/src/components/institution-settings/zustand";
import { toast } from "@/src/components/reusable/toaster/toast";
import type { VideoChatProviderId } from "@/src/types/video-chat-provider-integration.types";

export const triggerZoomAccountLimitWarning = (
  providerId: VideoChatProviderId,
  checked: boolean,
) => {
  const { institutionSettings } = useInstitutionSettings.getState();
  setTimeout(() => {
    if (
      providerId === "zoom" &&
      checked &&
      !institutionSettings.use_own_zoom_account
    ) {
      toast.warning("toast.zoom_use_not_own_account_title", {
        description: "toast.zoom_use_not_own_account_desc",
      });
    }
  }, 2500);
};
