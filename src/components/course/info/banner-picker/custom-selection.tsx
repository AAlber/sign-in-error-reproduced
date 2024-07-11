import { deleteCloudflareDirectories } from "@/src/client-functions/client-cloudflare";
import { updateCourseTheme } from "@/src/client-functions/client-course";
import { silentlyRefreshDynamicTabs } from "@/src/components/dashboard/functions";
import { FileDropField } from "@/src/components/reusable/file-uploaders/file-drop-field";
import { maxFileSizes } from "@/src/utils/utils";
import useCourse from "../../zustand";

export default function CustomBannerSelection() {
  const { hasSpecialRole } = useCourse();

  const { course, updateCourse } = useCourse();

  if (!hasSpecialRole) return null;

  return (
    <div className="max-w-[360px]">
      <FileDropField
        uploadPathData={{
          type: "public",
          subPath: "layer/" + course.layer_id + "/banner",
        }}
        autoProceed
        maxFileSize={maxFileSizes.images}
        allowedFileTypes={["image/*"]}
        onUploadCompleted={async (url: string) => {
          updateCourse({ ...course, bannerImage: url });
          await updateCourseTheme({
            course: {
              id: course.id,
              icon: course.icon,
              iconType: course.iconType,
              bannerImage: url,
            },
          });
          silentlyRefreshDynamicTabs();
          if (
            course.bannerImage?.startsWith(process.env.NEXT_PUBLIC_WORKER_URL!)
          ) {
            deleteCloudflareDirectories([
              {
                url: course.bannerImage,
                isFolder: false,
              },
            ]);
          }
        }}
      />
    </div>
  );
}
