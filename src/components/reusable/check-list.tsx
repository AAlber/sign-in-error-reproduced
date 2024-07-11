import { ArrowRight, Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import classNames from "@/src/client-functions/client-utils";

const CheckList = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <ul className={classNames("flex flex-col gap-1", className)}>{children}</ul>
  );
};

const Item = ({
  text,
  className = "",
  type = "check",
  variant = "neutral",
  secondaryText,
}: {
  text: string;
  secondaryText?: string;
  className?: string;
  type?: "check" | "cross" | "arrow";
  variant?: "positive" | "negative" | "neutral";
}) => {
  const { t } = useTranslation("page");
  const color =
    variant === "positive"
      ? "text-positive"
      : variant === "negative"
      ? "text-destructive"
      : "text-contrast";

  return (
    <div className={classNames(secondaryText ? "flex justify-between" : "")}>
      <p className={classNames("flex items-center gap-2", className)}>
        {type === "check" && (
          <Check className={classNames("h-3.5 w-3.5", color)} />
        )}
        {type === "cross" && <X className={classNames("h-3.5 w-3.5", color)} />}
        {type === "arrow" && (
          <ArrowRight className={classNames("h-3.5 w-3.5", color)} />
        )}
        <span className="flex items-center gap-2 text-sm ">{t(text)}</span>
      </p>
      {secondaryText && (
        <div className="pl-4 text-muted-contrast">{t(secondaryText)}</div>
      )}
    </div>
  );
};

Item.displayName = "Checklist Item";

CheckList.Item = Item;

export default CheckList;
