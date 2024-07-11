import { Copy } from "lucide-react";
import { useTranslation } from "react-i18next";
import { deepCopy } from "@/src/client-functions/client-utils";
import { importCourseDataFromCourse } from "@/src/components/popups/import-course-data-modal/functions";
import { DropdownMenuItem } from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import type { ContentBlock } from "@/src/types/course.types";
import useCourse from "../../../zustand";

function BlockOptionDuplicate({ block }: { block: ContentBlock }) {
  const { refreshCourse, setContentBlocks, contentBlocks, course } =
    useCourse();
  const { t } = useTranslation("page");

  const handleImport = async () => {
    const clonedBlocks = deepCopy(contentBlocks);
    const duplicate = clonedBlocks.find((b) => b.id === block.id)!;

    useCourse.setState((state) => ({
      contentBlocks: [
        ...state.contentBlocks,
        /**
         * just assign any temporary random id,
         * once refresh finish id will be unique
         */
        { ...duplicate, id: String(Math.random() * 9999) },
      ],
    }));

    try {
      await importCourseDataFromCourse({
        layerIdToImportFrom: course!.layer_id,
        layerIdToImportTo: course!.layer_id,
        overwriteExistingContent: false,
        selectedContentBlockIds: [block.id],
      });
      refreshCourse();
    } catch (e) {
      setContentBlocks(clonedBlocks);
    }
  };

  return (
    <DropdownMenuItem
      className="flex w-full cursor-pointer px-2"
      onClick={handleImport}
    >
      <Copy className="h-4 w-4" />
      <span className="text-sm">{t("duplicate")}</span>
    </DropdownMenuItem>
  );
}

export default BlockOptionDuplicate;
