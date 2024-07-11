import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getNotifications } from "@/src/client-functions/client-notifications";
import AsyncComponent from "../../../../reusable/async-component";
import Spinner from "../../../../spinner";
import { NoNotification } from "./no-notifications";
import NotificationItem from "./notification-item";
import useNotifications from "./zustand";

export default function NotificationList() {
  const { refreshTrigger, setUnreadCount } = useNotifications();

  useEffect(() => {
    setUnreadCount(0);
  }, []);
  const { t } = useTranslation("page");

  return (
    <AsyncComponent
      refreshTrigger={refreshTrigger}
      promise={getNotifications}
      loaderElement={
        <div className="flex h-full w-full items-center justify-center">
          <Spinner />
        </div>
      }
      errorElement={() => <span>{t("something_went_wrong")}</span>}
      component={(notifications) => {
        if (!notifications || notifications.length === 0)
          return <NoNotification />;

        return (
          <div className="h-[408px] overflow-scroll">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))}
          </div>
        );
      }}
    />
  );
}
