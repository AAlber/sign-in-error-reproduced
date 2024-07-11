import type { Notification as DatabaseNotification } from "@prisma/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { X } from "lucide-react";
import { deleteNotification } from "@/src/client-functions/client-notifications";
import classNames from "@/src/client-functions/client-utils";
import type { Notification } from "@/src/types/notification.types";
import useUser from "@/src/zustand/user";
import NotificationIcon from "./notification-icon";
import NotificationMessage from "./notification-message";
import useNotifications from "./zustand";

dayjs.extend(relativeTime);

export default function NotificationItem({
  notification,
}: {
  notification: DatabaseNotification;
}) {
  const { refresh } = useNotifications();
  const data = notification.data as Notification;
  const { user } = useUser();
  dayjs.locale(user.language);
  return (
    <div
      style={{
        opacity: notification.read ? 0.8 : 1,
      }}
      className={classNames(
        data.icon.type !== "info" && "cursor-pointer hover:bg-secondary",
        "group flex items-center justify-between border-b border-border px-4 py-3.5 ",
      )}
    >
      {/* Notification icon and message */}
      <div className="flex items-start gap-4">
        <NotificationIcon icon={data.icon} />
        <div className="flex flex-1 flex-col gap-1">
          <NotificationMessage notification={data} />
          <span className="text-xs text-muted-contrast">
            {dayjs(notification.createdAt).fromNow()}
          </span>
        </div>
      </div>
      {/* Delete notification button */}
      <button
        className="ml-2 text-muted-contrast opacity-0 hover:text-destructive group-hover:opacity-100 "
        onClick={async (e) => {
          e.stopPropagation();
          await deleteNotification(notification.id);
          refresh();
        }}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
