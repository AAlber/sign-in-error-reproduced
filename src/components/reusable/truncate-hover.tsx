import { useTranslation } from "react-i18next";
import { truncate } from "@/src/client-functions/client-utils";
import {
  HoverCard,
  HoverCardSheet,
  HoverCardTrigger,
} from "./shadcn-ui/hover-card";

type TruncateHoverProps = {
  text: string;
  className?: string;
  truncateAt: number;
  side?: "left" | "right" | "top" | "bottom";
};

export default function TruncateHover({
  side = "bottom",
  ...props
}: TruncateHoverProps) {
  const { t } = useTranslation("page");
  if (props.text.length <= props.truncateAt)
    return <div className={props.className}>{t(props.text)}</div>;

  return (
    <HoverCard openDelay={250} closeDelay={100}>
      <HoverCardTrigger className="cursor-default">
        <div className={props.className}>
          {truncate(
            t(props.text.startsWith("-new-folder") ? "" : props.text),
            props.truncateAt,
          )}
        </div>
      </HoverCardTrigger>
      <HoverCardSheet side={side}>{t(props.text)}</HoverCardSheet>
    </HoverCard>
  );
}
