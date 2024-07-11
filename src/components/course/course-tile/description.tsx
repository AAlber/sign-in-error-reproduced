import { useTranslation } from "react-i18next";
import { truncate } from "@/src/client-functions/client-utils";
import type { CourseWithDurationAndProgress } from "@/src/types/user.types";

export default function TileDescription({
  course,
}: {
  course: CourseWithDurationAndProgress;
}) {
  const { t } = useTranslation("page");

  return (
    <p className="text-sm text-muted-contrast">
      {truncate(t(course.description ?? ""), 30)}
    </p>
  );
}
