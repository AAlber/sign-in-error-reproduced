import { useTranslation } from "react-i18next";
import useCourse from "@/src/components/course/zustand";
import AccessGate from "@/src/components/reusable/access-gate";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/src/components/reusable/shadcn-ui/menubar";
import useWorkbench, { WorkbenchMode } from "../../zustand";
import WBMenuItemImport from "./wb-menu-import";
import WBMenuSubItemNew from "./wb-menu-new";
import WBMenuItemNewPage from "./wb-menu-new-page";
import WBMenuItemSave from "./wb-menu-save";

export function WorkbenchMenubar() {
  const { mode } = useWorkbench();
  const { course } = useCourse();
  const { t } = useTranslation("page");

  return (
    <AccessGate
      layerId={course?.layer_id ?? ""}
      rolesWithAccess={["moderator", "educator"]}
    >
      <Menubar className="border-transparent bg-transparent !shadow-none focus:outline-none dark:border-transparent dark:bg-transparent">
        <MenubarMenu>
          <MenubarTrigger>
            {t("workbench_header_file_dropdown_title")}
          </MenubarTrigger>
          <MenubarContent className="border-border bg-background opacity-100 !shadow-none focus:outline-none ">
            {mode === WorkbenchMode.CREATE && (
              <>
                <WBMenuItemNewPage />
                <WBMenuSubItemNew />
                <MenubarSeparator />
              </>
            )}
            <WBMenuItemSave />
            {mode === WorkbenchMode.CREATE && (
              <>
                <WBMenuItemImport />
                <MenubarSeparator />
                <MenubarItem disabled>
                  {t("workbench_header_file_dropdown_print")}
                </MenubarItem>
              </>
            )}
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </AccessGate>
  );
}
