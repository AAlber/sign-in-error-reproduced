import { HelpCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  HoverCard,
  HoverCardSheet,
  HoverCardTrigger,
} from "./shadcn-ui/hover-card";

export type WithToolTipProps = {
  text: string;
  disabled?: boolean;
  children?: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  delay?: number;
  className?: string;
  node?: React.ReactNode;
};

export default function WithToolTip({
  side = "bottom",
  delay = 100,
  ...props
}: WithToolTipProps) {
  const { t } = useTranslation("page");

  if (props.disabled) return props.children as JSX.Element;

  return (
    <HoverCard openDelay={delay} closeDelay={0}>
      <HoverCardTrigger className={props.className}>
        {props.children ? (
          props.children
        ) : (
          <HelpCircle className="size-4 text-muted-contrast" />
        )}
      </HoverCardTrigger>
      <HoverCardSheet side={side}>
        {props.node ? props.node : t(props.text)}
      </HoverCardSheet>
    </HoverCard>
  );
}
