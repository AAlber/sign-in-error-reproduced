import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import useCourse from "../../course/zustand";
import Box from "../../reusable/box";
import Tick from "../../reusable/settings-ticks/tick";
import { importCourseDataFromCourse } from "./functions";
import useImportCourseDataModal from "./zustand";

export const ImportActionButtons = () => {
  const { refreshCourse } = useCourse();
  const { t } = useTranslation("page");
  const [loading, setLoading] = useState(false);
  const {
    open,
    setOpen,
    layerToImportToId,
    layerToImportFromId,
    selectedContentBlockIds,
    setSelectedContentBlockIds,
    overrideData,
  } = useImportCourseDataModal();
  useEffect(() => {
    if (!open) return;
    setSelectedContentBlockIds([]);
  }, [open]);

  return (
    <div className="flex items-center justify-end gap-2">
      <Button size={"button"} onClick={() => setOpen(false)}>
        {t("general.cancel")}
      </Button>
      <Button
        variant={"cta"}
        size={"button"}
        disabled={
          loading || layerToImportFromId === "" || layerToImportToId === ""
        }
        onClick={async () => {
          setLoading(true);
          try {
            await importCourseDataFromCourse({
              layerIdToImportTo: layerToImportToId,
              layerIdToImportFrom: layerToImportFromId,
              overwriteExistingContent: overrideData,
              selectedContentBlockIds,
            });
            refreshCourse();
          } catch (e) {
            console.log(e);
          } finally {
            setOpen(false);
            setLoading(false);
          }
        }}
      >
        {t(
          loading
            ? "general.loading"
            : "admin_dashboard.layer_options_import_button",
        )}
      </Button>
    </div>
  );
};

export const DataImportBox = () => {
  const { t } = useTranslation("page");
  const { overrideData, setOverrideData } = useImportCourseDataModal();
  return (
    <Box noPadding>
      <li className="flex items-center justify-between px-2">
        <p className="t-danger flex h-8 items-center gap-2 text-sm">
          <span>{t("import_course_data_override")}</span>
        </p>
        <Tick
          checked={overrideData}
          onChange={() => setOverrideData(!overrideData)}
        />
      </li>
    </Box>
  );
};
