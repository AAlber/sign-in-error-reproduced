import { Import } from "lucide-react";
import { useTranslation } from "react-i18next";
import useImportCourseDataModal from "@/src/components/popups/import-course-data-modal/zustand";
import { DropdownMenuItem } from "@/src/components/reusable/shadcn-ui/dropdown-menu";

export default function LayerOptionsImportCourse({ layer }: any) {
  const { init } = useImportCourseDataModal();
  const { t } = useTranslation("page");

  return (
    <DropdownMenuItem
      data-testid="button-option-appointments"
      className="flex w-full px-2"
      onClick={() => init(layer.id)}
    >
      <Import className="h-4 w-4 text-contrast" />
      <span className="text-sm text-contrast">
        {t("admin_dashboard.layer_options_import_course")}
      </span>
    </DropdownMenuItem>
  );
}
