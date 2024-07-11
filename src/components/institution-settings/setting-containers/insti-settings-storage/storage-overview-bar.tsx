import classNames from "@/src/client-functions/client-utils";
import { BYTES_IN_1GB } from "@/src/utils/utils";
import Skeleton from "../../../skeleton";

export type StorageStatus = {
  totalSize: number;
  categories: {
    size: number;
    title: string;
  }[];
};

export default function StorageOverviewBar({
  loading,
  storageStatus,
}: {
  loading: boolean;
  storageStatus?: StorageStatus;
}) {
  return (
    <div className="flex h-8 w-full overflow-hidden rounded-lg border border-border">
      {loading || !storageStatus ? (
        <Skeleton />
      ) : (
        <>
          {storageStatus.categories.map((category, i) => {
            return (
              <div
                key={i}
                style={{
                  width: `${
                    (category.size / (storageStatus.totalSize * BYTES_IN_1GB)) *
                    100
                  }%`,
                }}
                className={classNames(
                  //TODO: Allow for more than 2 categories to be displayed
                  i === 0 ? "bg-primary" : "bg-accent",
                  i === storageStatus.categories.length - 1 && "ml-[1px]",
                  "h-full",
                )}
              ></div>
            );
          })}
        </>
      )}
    </div>
  );
}
