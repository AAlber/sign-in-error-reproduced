import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../reusable/shadcn-ui/popover";
import NotificationList from "./notification-list";
import NotificationsHeader from "./notifications-header";
import NotificationPopoverTrigger from "./notifications-trigger";

export default function Notifications() {
  return (
    <Popover>
      <PopoverTrigger>
        <NotificationPopoverTrigger />
      </PopoverTrigger>
      <PopoverContent
        side="right"
        className="mr-14 mt-2 h-[450px] w-[350px] p-0"
      >
        <NotificationsHeader />
        <NotificationList />
      </PopoverContent>
    </Popover>
  );
}
