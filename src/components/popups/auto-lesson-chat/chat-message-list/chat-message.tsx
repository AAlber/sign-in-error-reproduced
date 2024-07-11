import { useUser } from "@clerk/nextjs";
import React from "react";
import { verifyContrast } from "@/src/client-functions/client-institution-theme";
import classNames from "@/src/client-functions/client-utils";
import useThemeStore from "@/src/components/dashboard/navigation/primary-sidebar/user-menu/theme-switcher/zustand";
import UserDefaultImage from "@/src/components/user-default-image";

export default function ChatMessage({ message }) {
  const { user } = useUser();
  const { instiTheme } = useThemeStore();

  return (
    <div
      id={message.id}
      className={classNames(
        "flex min-h-10 w-full items-end gap-2",
        message.role === "assistant" ? "justify-start" : "justify-end",
      )}
    >
      <div
        className={classNames(
          "max-w-[75%] overflow-hidden",
          message.role === "assistant"
            ? "rounded-b-lg rounded-tr-lg bg-accent text-contrast"
            : "rounded-t-lg rounded-bl-lg bg-primary text-contrast",
          verifyContrast(instiTheme) && !(message.role === "assistant")
            ? "text-background"
            : "",
        )}
      >
        <div className="p-1.5">{message.content}</div>
      </div>
      {message.role === "user" && (
        <UserDefaultImage
          user={{
            id: user?.id,
            image: user?.imageUrl,
          }}
          dimensions="w-7 h-7"
        />
      )}
    </div>
  );
}
