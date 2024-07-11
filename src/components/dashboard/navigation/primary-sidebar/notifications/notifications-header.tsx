import { useState } from "react";
import { useTranslation } from "react-i18next";
import { deleteAllNotifications } from "@/src/client-functions/client-notifications";
import useNotifications from "./zustand";

export default function NotificationsHeader() {
  const { t } = useTranslation("page");
  const { unreadCount: count, refresh } = useNotifications();
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex h-[40px] w-full items-center justify-between border-b border-border px-3 py-2 ">
      <h2 className="text-contrast">{t("notifications.header_inbox")}</h2>
      <button
        onClick={async () => {
          setLoading(true);
          await deleteAllNotifications();
          refresh();
          setLoading(false);
        }}
      >
        <span className="text-xs text-muted-contrast hover:text-destructive">
          {loading
            ? t("notifications.header_loading")
            : t("notifications.header_clear_all")}
        </span>
      </button>
    </div>
  );
}
