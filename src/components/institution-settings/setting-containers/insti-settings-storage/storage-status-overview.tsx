import type { StorageStatus } from "./storage-overview-bar";
import StorageOverviewBar from "./storage-overview-bar";
import StorageStatuses from "./storage-statuses";

export default function StorageStatusOverView({
  loading,
  storageStatus,
}: {
  loading: boolean;
  storageStatus?: StorageStatus;
}) {
  return (
    <>
      <StorageOverviewBar loading={loading} storageStatus={storageStatus} />
      <StorageStatuses storageStatus={storageStatus} />
    </>
  );
}
