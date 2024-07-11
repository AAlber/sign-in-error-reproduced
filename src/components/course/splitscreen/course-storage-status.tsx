import { useDynamicDrive } from "@/src/client-functions/client-cloudflare/hooks";
import StorageStatusOverView from "../../institution-settings/setting-containers/insti-settings-storage/storage-status-overview";
import { useInstitutionSettings } from "../../institution-settings/zustand";

const CourseStorageStatus = () => {
  const { storage_course_limit } = useInstitutionSettings().institutionSettings;

  const { loadingFiles, storageCategories } = useDynamicDrive();
  return !storageCategories ? (
    <></>
  ) : (
    <div className="mx-2 mt-2 basis-1/5 rounded-md border border-border bg-foreground p-2">
      <StorageStatusOverView
        loading={loadingFiles}
        storageStatus={{
          totalSize: storage_course_limit,
          categories: storageCategories,
        }}
      />
    </div>
  );
};

CourseStorageStatus.displayName = "CourseStorageStatus";

export { CourseStorageStatus };
