import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/reusable/shadcn-ui/card";
import Modal from "../../reusable/modal";
import DataToImportSelector from "./data-to-import-selector";
import { DataImportBox, ImportActionButtons } from "./import-course-components";
import SearchCourseInput from "./search-course-input";
import useImportCourseDataModal from "./zustand";

export default function ImportCourseDataModal() {
  const { open, setOpen, layerToImportFromId, setSelectedContentBlockIds } =
    useImportCourseDataModal();
  const { t } = useTranslation("page");

  useEffect(() => {
    if (!open) return;
    setSelectedContentBlockIds([]);
  }, [open]);

  return (
    <Modal
      allowCloseOnEscapeOrClickOutside={false}
      open={open}
      setOpen={setOpen}
    >
      <div className="flex flex-col gap-2">
        <CardHeader className="px-0 pb-4 pt-0">
          <CardTitle> {t("import_course_data")}</CardTitle>
          <CardDescription>
            {t("import_course_data_description")}
          </CardDescription>
        </CardHeader>

        <SearchCourseInput />
        {layerToImportFromId && (
          <>
            <DataToImportSelector />
            <DataImportBox />
          </>
        )}
        <ImportActionButtons />
      </div>
    </Modal>
  );
}
