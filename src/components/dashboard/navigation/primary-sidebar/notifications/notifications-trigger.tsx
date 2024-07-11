import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { countNotifications } from "@/src/client-functions/client-notifications";
import PrimaryNavigationItem from "../primary-navigation-item";
import useNotifications from "./zustand";

export default function NotificationPopoverTrigger() {
  const [isLoading, setIsLoading] = useState(true);
  const { unreadCount, refreshTrigger, setUnreadCount } = useNotifications();

  useEffect(() => {
    setIsLoading(true);
    countNotifications().then((count) => {
      setTimeout(() => {
        if (!count) return setIsLoading(false);
        setUnreadCount(count.unreadNotifications);
        setIsLoading(false);
      }, 500);
    });
  }, [refreshTrigger]);

  return (
    <PrimaryNavigationItem
      hoverTitle={"notifications.header_inbox"}
      icon={<Bell size={18} />}
      numberIndicator={unreadCount}
      isActive={false}
    />
  );
}
