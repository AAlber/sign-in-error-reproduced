import type { TFunction } from "i18next";
import { dismissToast } from "@/src/components/reusable/toaster/functions";
import useUser from "@/src/zustand/user";
import confirmAction from "../client-options-modal";

type Args = {
  message: string;
  title: string;
} & NotificationOptions;

export function browserNotificationHandler({
  message,
  title,
  ...options
}: Args) {
  if (Notification.permission !== "granted") return;
  return new Notification(title, { body: message, ...options });
}

export async function requestNotificationsPermission(translate: TFunction) {
  if (!("Notification" in window)) return;

  const { setNotificationsPreference } = useUser.getState();
  if (Notification.permission === "default") {
    const result = await Notification.requestPermission();
    const H24 = 1000 * 60 * 60 * 24;

    dismissToast();
    /**
     * `result` can be default if the user just skips
     * or clicks on X button instead of selecting Allow/Not Allow
     */
    setNotificationsPreference({
      requestPermissionAgainAt:
        result !== "default" ? undefined : Date.now() + H24, // we remind again after 24H have passed
    });

    if (result === "denied") informUserOfBlockedNotifications(translate);
  }
}

function informUserOfBlockedNotifications(t: TFunction) {
  /**
   * just shows a modal informing user that they must go
   * inside browser settings to update notifications permissions
   */
  confirmAction(
    () => {
      // dummy action
    },
    {
      title: t("notifications.blocked.title"),
      description: t("notifications.blocked.description"),
      actionName: t("general.close"),
      allowCancel: false,
    },
  );
}
