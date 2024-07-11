import { useTranslation } from "react-i18next";
import classNames from "@/src/client-functions/client-utils";
import type { BadgeColors } from "@/src/components/reusable/badges/badge";
import Badge from "@/src/components/reusable/badges/badge";
import TruncateHover from "@/src/components/reusable/truncate-hover";

export default function PriceDisplay({
  title,
  price,
  badgeText,
  showBadge,
  badgeColor,
  shinyBadge,
  descriptionText,
  currency,
  size = "md",
}: {
  title: string;
  showBadge?: boolean;
  badgeColor?: BadgeColors;
  badgeText?: string;
  shinyBadge?: boolean;
  price: string;
  descriptionText: string;
  currency?: string;
  size?: "sm" | "md" | "lg";
}) {
  const { t } = useTranslation("page");
  return (
    <div
      className={classNames(
        " flex items-center justify-start",
        size === "lg" ? "h-40 w-60" : size === "sm" ? "" : "w-50",
      )}
    >
      <p className=" flex flex-col text-5xl font-bold text-contrast">
        <span
          className={classNames("flex items-center gap-1 text-lg font-medium")}
        >
          <TruncateHover text={title} truncateAt={12} />
          {showBadge && (
            <div className="mb-1">
              <Badge title={badgeText} color={badgeColor} shine={shinyBadge} />
            </div>
          )}
        </span>
        <span>{price + (currency || "€")}</span>
        <span
          className={classNames(
            size === "sm" ? "" : size === "lg" ? "w-[180px]" : "w-[160px]",
            " break-words text-sm font-normal text-muted-contrast",
          )}
        >
          {descriptionText}
        </span>
      </p>
    </div>
  );
}
