import { useTranslation } from "react-i18next";
import classNames from "@/src/client-functions/client-utils";
import Switch from "@/src/components/reusable/settings-switches/switch";
import Badge from "../badges/badge";

export default function SwitchItem({
  checked,
  onChange,
  label,
  description,
  badgeText,
  showBadge,
  badgeColor = "blue",
  disabled = false,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  showBadge?: boolean;
  badgeText?: string;
  badgeColor?: "blue" | "green";
  disabled?: boolean;
}) {
  const { t } = useTranslation("page");

  return (
    <div
      className={classNames(
        description ? "items-start" : "items-center",
        "flex justify-between gap-3 px-2 py-3 text-sm text-contrast",
      )}
    >
      <div className="flex flex-col gap-0.5">
        <div className="flex gap-x-2">
          <h1 className="text-contrast">{t(label)}</h1>
          {showBadge && <Badge title={badgeText} color={badgeColor} />}
        </div>
        {description && (
          <p className="text-xs dark:text-muted-contrast">{t(description)}</p>
        )}
      </div>
      <Switch checked={checked} onChange={onChange} disabled={disabled} />
    </div>
  );
}
