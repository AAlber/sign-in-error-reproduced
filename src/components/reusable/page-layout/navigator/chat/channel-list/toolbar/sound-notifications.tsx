import { BellOff, BellPlus } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/components/reusable/shadcn-ui/tooltip";
import useUser from "@/src/zustand/user";

export default function SoundNotificationsButton() {
  const {
    setNotificationsPreference,
    notificationsPreference: { isSoundNotificationsEnabled },
  } = useUser();

  const { t } = useTranslation("page");

  const toggleSoundNotifications = () => {
    setNotificationsPreference({
      isSoundNotificationsEnabled: !isSoundNotificationsEnabled,
    });
  };

  return (
    <Tooltip delayDuration={1400}>
      <TooltipTrigger>
        {isSoundNotificationsEnabled ? (
          <BellPlus
            size={16}
            className="cursor-pointer text-muted hover:text-contrast"
            onClick={toggleSoundNotifications}
          />
        ) : (
          <BellOff
            size={16}
            className="cursor-pointer text-muted hover:text-contrast"
            onClick={toggleSoundNotifications}
          />
        )}
      </TooltipTrigger>
      <TooltipContent>
        {isSoundNotificationsEnabled
          ? t("notifications.on")
          : t("notifications.off")}
      </TooltipContent>
    </Tooltip>
  );
}
