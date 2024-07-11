import cuid from "cuid";
import { useTranslation } from "react-i18next";
import type { OnSelectArgs } from "@/src/components/reusable/page-layout/navigator/zustand";
import useNavigationOverlay from "@/src/components/reusable/page-layout/navigator/zustand";
import { MenubarItem } from "@/src/components/reusable/shadcn-ui/menubar";
import { OpenOrigin } from "@/src/file-handlers/zustand";
import type { WorkbenchContent } from "../../types";
import useWorkbench from "../../zustand";

export default function WBMenuItemImport() {
  const { setOpen } = useWorkbench();
  const { openCloudImport } = useNavigationOverlay();
  const { t } = useTranslation("page");

  return (
    <MenubarItem
      onClick={() => {
        setOpen(false);
        openCloudImport({
          openOrigin: OpenOrigin.Default,
          acceptedFileTypes: ["learning", "assessment"],
          onCancel: () => {
            setOpen(true);
          },
          onSelect: async (args: OnSelectArgs) => {
            const { fileBlob } = args;
            const text = await fileBlob.text();
            const content = JSON.parse(text) as WorkbenchContent;
            const { getPages, setPages } = useWorkbench.getState();
            const pages = getPages();
            const pagesWithNewIds = content.pages.map((page) => ({
              ...page,
              id: cuid(),
            }));
            setPages([...pages, ...pagesWithNewIds]);
            setOpen(true);
          },
        });
      }}
    >
      {t("workbench_header_file_dropdown_import")}
    </MenubarItem>
  );
}
