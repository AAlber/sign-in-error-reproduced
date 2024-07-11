import dayjs from "dayjs";
import prettyBytes from "pretty-bytes";
import { useTranslation } from "react-i18next";
import { BYTES_IN_1GB } from "@/src/utils/utils";
import useStorageSettings from "../zustand";

export default function StorageCards() {
  const { t } = useTranslation("page");
  const { storageSubscription, loading, added25gbPackages } =
    useStorageSettings();
  const doesNotHaveAdditionalStorage = !storageSubscription && !loading;
  const quantity = doesNotHaveAdditionalStorage
    ? added25gbPackages
    : storageSubscription?.quantity;

  return (
    <div className="h-30 mb-1 w-[240px] items-center justify-start rounded-md border border-border p-4">
      <div className="text-sm text-muted-contrast">
        {t("additional_storage")}
      </div>
      <div className="mt-2 text-3xl font-semibold">
        {quantity && quantity > 0
          ? prettyBytes(BYTES_IN_1GB * 25 * quantity)
          : ""}
      </div>
      {doesNotHaveAdditionalStorage || !storageSubscription ? (
        <div className="text-sm text-muted-contrast">
          {t(loading ? "general.loading" : "not_purchased_yet")}
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="text-sm text-muted-contrast">{t("next_invoice")}</div>
          <div className="text-sm font-semibold">
            {dayjs(
              new Date(storageSubscription.current_period_end * 1000),
            ).format("DD.MM.YYYY")}
          </div>
        </div>
      )}
    </div>
  );
}
