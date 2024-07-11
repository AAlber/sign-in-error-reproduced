import { Import } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toastNoSubscription } from "@/src/client-functions/client-stripe/alerts";
import { hasActiveSubscription } from "@/src/client-functions/client-stripe/data-extrapolation";
import useImportCourseDataModal from "@/src/components/popups/import-course-data-modal/zustand";
import { DropdownMenuItem } from "../../../reusable/shadcn-ui/dropdown-menu";
import useCourse from "../../zustand";

export default function ImportContent() {
  const { course } = useCourse();
  const { init } = useImportCourseDataModal();
  const { t } = useTranslation("page");

  return (
    <DropdownMenuItem
      onClick={() => {
        if (!hasActiveSubscription()) return toastNoSubscription();
        init(course?.layer_id ?? "");
      }}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background">
        <Import
          size={16}
          className="flex w-[1.15rem] justify-center text-contrast"
        />
      </div>
      <div className="flex flex-col">
        {t("import")}
        <span className="text-xs text-muted-contrast">
          {t(t("import-description"))}
        </span>
      </div>
    </DropdownMenuItem>
  );
}
