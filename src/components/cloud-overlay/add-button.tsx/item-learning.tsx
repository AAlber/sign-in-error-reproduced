import { BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DropdownMenuItem } from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import useFile, { OpenOrigin } from "@/src/file-handlers/zustand";
import useWorkbench, {
  WorkbenchType,
} from "../../workbench-deprecated/zustand";

export default function CloudAddItemLearning() {
  const { openEmptyWorkbench } = useWorkbench();
  const { setOpenedFrom } = useFile();
  const { t } = useTranslation("page");
  return (
    <DropdownMenuItem
      onClick={() => {
        setOpenedFrom(OpenOrigin.Cloud);
        openEmptyWorkbench(WorkbenchType.LEARNING);
      }}
      className="flex w-full items-center px-2 py-1 "
    >
      <BookOpen className="mr-3 h-4 w-4 text-contrast" aria-hidden="true" />
      <span className="text-sm text-contrast">
        {t("cloud.create_learning")}
      </span>
    </DropdownMenuItem>
  );
}
