import { useAuth } from "@clerk/nextjs";
import clsx from "clsx";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useTypingContext } from "stream-chat-react";
import { filterUndefined } from "@/src/utils/utils";
import type { StreamChatGenerics } from "./types";

const TypingIndicator = () => {
  const { userId: authId } = useAuth();
  const { typing } = useTypingContext<StreamChatGenerics>();

  const userTyping = useMemo(() => {
    if (!typing) return {};
    const typingUsers = Object.entries(typing)
      .map(([userId, val]) => {
        if (!val) return;
        if (userId === authId) return;
        return val.user?.name;
      })
      .filter(filterUndefined);

    const str =
      typingUsers.length > 3
        ? typingUsers.slice(0, 3).join(", ") +
          `and ${typingUsers.length - 3} other`
        : typingUsers.join(", ");

    const len = typingUsers.length;

    return { str, len };
  }, [typing]);

  const authUserIsTyping = !!Object.keys(typing ?? {}).includes(
    authId as string,
  );

  const isTyping = !!userTyping.len || authUserIsTyping;

  const { t } = useTranslation("page");

  return (
    <div className="-mt-6 flex h-6 w-auto items-center justify-between text-xs text-muted-contrast transition-colors">
      <Span isTyping={isTyping}>
        {!!userTyping.str &&
          `${userTyping.str} ${
            userTyping.len > 1
              ? t("course_lobby_typing1")
              : t("course_lobby_typing2")
          } ${t("course_lobby_typing3")} `}
      </Span>
      <Span isTyping={isTyping}>
        {authUserIsTyping && (
          <>
            <b>{t("course_lobby_command1")}</b> {t("course_lobby_command2")}
          </>
        )}
      </Span>
    </div>
  );
};

export default TypingIndicator;

const Span = (
  props: { isTyping?: boolean } & React.HTMLAttributes<HTMLSpanElement>,
) => {
  const { isTyping, ...rest } = props;
  return (
    <span
      className={clsx(isTyping ? "block bg-background" : "bg-transparent")}
      {...rest}
    />
  );
};
