import dayjs from "dayjs";
import prettyBytes from "pretty-bytes";
import { useTranslation } from "react-i18next";
import { BYTES_IN_1GB } from "@/src/utils/utils";
import useStorageSettings from "./zustand";

export default function StoragePurchased() {
  const { t } = useTranslation("page");
  const { storageSubscription } = useStorageSettings();
  const quantity = storageSubscription?.quantity;
  return storageSubscription && quantity ? (
    <div className="mb-2 rounded-md border border-border px-4 py-2">
      <div className="mb-1 flex gap-2">
        <div className="text-sm text-muted-contrast">
          {t("current_additional_storage")}
        </div>
        <div className="text-sm font-semibold">
          {quantity > 0
            ? ` 25GB x ${quantity} = ${prettyBytes(
                BYTES_IN_1GB * 25 * quantity,
              )}`
            : ""}
        </div>
      </div>
      <div className="flex gap-2">
        <div className="text-sm text-muted-contrast">
          {t("next_invoice_on")}
        </div>
        <div className="text-sm font-semibold">
          {dayjs(
            new Date(storageSubscription.current_period_end * 1000),
          ).format("DD.MM.YYYY")}
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}
