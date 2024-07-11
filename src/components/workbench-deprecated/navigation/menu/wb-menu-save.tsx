import { useTranslation } from "react-i18next";
import type { UploadObject } from "@/src/components/reusable/page-layout/navigator/zustand";
import useNavigationOverlay from "@/src/components/reusable/page-layout/navigator/zustand";
import { MenubarItem } from "@/src/components/reusable/shadcn-ui/menubar";
import { toast } from "@/src/components/reusable/toaster/toast";
import useWorkbench, { WorkbenchType } from "../../zustand";

export default function WBMenuItemSave() {
  const { content, setOpen, workbenchType } = useWorkbench();
  const { openCloudExport } = useNavigationOverlay();
  const getFile = () => {
    const string = JSON.stringify(content, null, 2);
    return new Blob([string], { type: "application/json" });
  };

  const { t } = useTranslation("page");

  return (
    <MenubarItem
      onClick={() => {
        if (content.pages.length > 0) {
          if (!content.title) {
            useWorkbench.setState({ noNameError: true });
            return;
          }
          setOpen(false);
          openCloudExport({
            onSave: () => {
              const objForUpload: UploadObject = {
                name:
                  content.title +
                  (workbenchType === WorkbenchType.ASSESSMENT
                    ? ".assess"
                    : ".learn"),
                file: getFile(),
                type:
                  workbenchType === WorkbenchType.ASSESSMENT
                    ? "assessment"
                    : "learning",
              };
              setOpen(true);
              return Promise.resolve(objForUpload);
            },
          });
        } else {
          toast.warning("toast.workbench_save_warning", {
            icon: "👀",
            description: "toast.workbench_save_warning_description",
          });
        }
      }}
    >
      {t("workbench_header_file_dropdown_save_to_drive")}
    </MenubarItem>
  );
}
