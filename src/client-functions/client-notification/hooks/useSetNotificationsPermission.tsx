import { t } from "i18next";
import { useEffect } from "react";
import { dismissToast } from "@/src/components/reusable/toaster/functions";
import { toast } from "@/src/components/reusable/toaster/toast";
import useUser from "@/src/zustand/user";
import { requestNotificationsPermission } from "..";

/**
 * This hook is used to trigger a browser notification permission request in a fresh state
 * after a few seconds of opening fuxam.app - prompting users to decide whether they wish
 * to receive notifications from the site. If the cancel button is clicked, the notification
 * will reappear on page refresh after 5 minutes have passed. The notification will cease to
 * appear once the user has explicitly allowed or restricted browser notifications.
 */

export default function useSetNotificationsPermission() {
  const {
    notificationsPreference: { requestPermissionAgainAt },
    setNotificationsPreference,
  } = useUser();

  const onAllow = () => requestNotificationsPermission(t);
  const onCancel = () => {
    setNotificationsPreference({
      requestPermissionAgainAt: Date.now() + 1000 * 60 * 5, // remind again when browser refreshes and after 5mins have passed
    });
    dismissToast();
  };

  useEffect(
    () => {
      // skip step if Notification is not defined such as in mobile browsers
      if (!window.Notification?.permission) return;

      const shouldRequestNotificationsPermission =
        Notification.permission === "default" &&
        (typeof requestPermissionAgainAt === "undefined" ||
          Date.now() > requestPermissionAgainAt);

      if (shouldRequestNotificationsPermission) {
        const timeout = setTimeout(() => {
          toast.info("notifications.permission.request.title", {
            description: "notifications.permission.request.description",
            duration: 60000,
            actionCTA: {
              label: "Allow",
              onClick: onAllow,
            },
            action: {
              label: "Cancel",
              onClick: onCancel,
            },
          });
        }, 4000);

        return () => {
          clearTimeout(timeout);
        };
      }
    },
    typeof window !== "undefined" && window.Notification?.permission
      ? [Notification?.permission]
      : [],
  );
}
