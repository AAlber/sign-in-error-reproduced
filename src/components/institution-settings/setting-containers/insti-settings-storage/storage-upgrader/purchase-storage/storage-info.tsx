import prettyBytes from "pretty-bytes";
import { useTranslation } from "react-i18next";

export function StorageInfo({
  currentQuantity,
  currentQuantityInBytes,
}: {
  currentQuantity?: number | null;
  currentQuantityInBytes: number | null;
}) {
  const { t } = useTranslation("page");
  return (
    <div>
      <div className="font-semibold">{t("25gb_additional_storage")}</div>
      <div className="text-sm text-muted-contrast">
        {currentQuantityInBytes && currentQuantityInBytes > 0
          ? t("current") +
            ` 25GB x ${currentQuantity} = ${prettyBytes(
              currentQuantityInBytes,
            )}`
          : ""}
      </div>
    </div>
  );
}
