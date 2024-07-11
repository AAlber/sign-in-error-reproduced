import { AlertTriangle, CheckCircle, Info, XOctagon } from "lucide-react";
import Image from "next/image";
import type { NotificationIcon } from "@/src/types/notification.types";

export default function NotificationIcon({ icon }: { icon: NotificationIcon }) {
  if (icon.type === "warning") {
    return (
      <div className="notification-icon h-9 w-9 border border-yellow-300 bg-yellow-100 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200">
        <AlertTriangle className="h-5 w-5" />
      </div>
    );
  }

  if (icon.type === "error") {
    return (
      <div className="notification-icon h-9 w-9 border border-red-300 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
        <XOctagon className="h-5 w-5" />
      </div>
    );
  }

  if (icon.type === "success") {
    return (
      <div className="notification-icon h-9 w-9 border border-emerald-300 bg-emerald-100 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
        <CheckCircle className="h-5 w-5" />
      </div>
    );
  }

  if (icon.type === "user" && icon.src) {
    return (
      <Image
        className="notification-icon h-9 w-9 border border-border object-cover "
        src={icon.src}
        alt="User Image"
        priority
        width={32}
        height={32}
      />
    );
  }

  return (
    <div className="notification-icon h-9 w-9 border border-blue-300 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200">
      <Info className="h-5 w-5" />
    </div>
  );
}
