import React from "react";
import { useTranslation } from "react-i18next";
import type { Notification } from "@/src/types/notification.types";

export default function NotificationMessage({
  notification,
}: {
  notification: Notification;
}) {
  const { t } = useTranslation("page");

  const messageComponents = t(notification.message).split(/(\{\{[^\}]+\}\})/);

  return (
    <span className="text-sm text-contrast text-opacity-90 dark:text-opacity-90">
      {messageComponents.map((part, index) => {
        const targetKeyMatch = part.match(/\{\{([^}]+)\}\}/);
        if (targetKeyMatch && targetKeyMatch[1]) {
          const keyParts = targetKeyMatch[1].split(".");
          let targetValue: any = notification.messageValues; // to allow for nested translation key (e.g: {{course.name}})

          for (const part of keyParts) {
            if (
              targetValue !== null &&
              typeof targetValue === "object" &&
              part in targetValue
            ) {
              targetValue = targetValue[part];
            } else {
              targetValue = null;
              break;
            }
          }

          // Renders it with font-medium if it's a messageValue
          if (targetValue !== null) {
            return (
              <span key={index} className="font-medium text-contrast">
                {targetValue}
              </span>
            );
          }
        }

        return <span key={index}>{t(part)}</span>;
      })}
    </span>
  );
}
