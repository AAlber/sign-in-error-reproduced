import clsx from "clsx";
import { useTranslation } from "react-i18next";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/src/components/reusable/shadcn-ui/hover-card";
import type { ReactionType } from "./get-reactions";

const SingleReaction = (props: {
  reaction: ReactionType;
  onClick: (type: string, hasOwnReaction: boolean) => void;
}) => {
  const { onClick, reaction } = props;
  const { count, hasOwnReaction, type, users } = reaction;
  const { t } = useTranslation("page");

  const reactors = users.reduce((p, c, idx) => {
    if (idx === 0) return c.name ?? c.email ?? c.id;
    return `${p}, ${c.name}`;
  }, "");

  return (
    <HoverCard>
      <HoverCardTrigger
        onClick={() => onClick(type, hasOwnReaction)}
        key={type}
        className={clsx(
          "transition-color relative flex min-h-[26px] w-[48px] cursor-pointer items-center justify-center space-x-1 rounded-full border px-2",
          hasOwnReaction
            ? "border-primary/80 bg-secondary"
            : "border-border bg-foreground [&_span]:dark:hover:text-blue-400",
        )}
      >
        <span className="relative -left-[3px] -top-[2px]">
          <em-emoji id={type} size="4em"></em-emoji>
        </span>
        <span
          className={clsx(
            "text-[12px]",
            hasOwnReaction ? "text-primary/80" : "text-muted-contrast",
          )}
        >
          {count}
        </span>
      </HoverCardTrigger>
      {!!reactors && (
        <HoverCardContent className="!m-0 !w-[200px] !p-2">
          <div className="relative mb-1 flex min-h-[32px] flex-col items-center justify-center text-center [&_.emoji-mart-emoji]:!text-[24px]">
            <em-emoji id={type} size={24}></em-emoji>
          </div>
          <div className="whitespace-pre-wrap text-center text-xs">
            <span>
              {reactors}
              {hasOwnReaction
                ? ` ${t("chat.messages.reactions.and_you")} `
                : " "}
            </span>
            <span className="text-muted-contrast">
              {t("chat.messages.reactions.reacted_with")} :{type}
            </span>
          </div>
        </HoverCardContent>
      )}
    </HoverCard>
  );
};

export default SingleReaction;
