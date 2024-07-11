import prettyBytes from "pretty-bytes";
import { useTranslation } from "react-i18next";
import Skeleton from "@/src/components/skeleton";
import { BYTES_IN_1GB } from "@/src/utils/utils";
import type { StorageStatus } from "./storage-overview-bar";
import StorageStatusWithLoader from "./storage-status-with-loader";

export default function StorageStatuses({
  storageStatus,
}: {
  storageStatus?: StorageStatus;
}) {
  const { t } = useTranslation("page");
  const totalStorageInBytes = (storageStatus?.totalSize || 0) * BYTES_IN_1GB;
  return (
    <>
      {!storageStatus ? (
        <div className="my-4 h-14 max-w-36 overflow-hidden rounded-md">
          <Skeleton />
        </div>
      ) : (
        <div className="my-4">
          <div className="mb-1 mt-4 text-sm text-muted-contrast">
            {t("total_storage")}:{" "}
            <span className="text-contrast">
              {storageStatus?.totalSize ? prettyBytes(totalStorageInBytes) : 0}
            </span>
          </div>
          {storageStatus?.categories.map((category, i) => {
            return (
              <div
                key={i}
                className={
                  i !== storageStatus.categories.length - 1 ? "mb-1" : ""
                }
              >
                <StorageStatusWithLoader
                  size={category.size}
                  title={category.title}
                />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
