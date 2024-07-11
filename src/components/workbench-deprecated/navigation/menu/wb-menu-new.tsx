import { useTranslation } from "react-i18next";
import {
  MenubarItem,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
} from "@/src/components/reusable/shadcn-ui/menubar";
import useWorkbench from "../../zustand";

export default function WBMenuSubItemNew() {
  const { insertNewPage, currentPage, getIndexOfPage } = useWorkbench();
  const { t } = useTranslation("page");

  return (
    <MenubarSub>
      <MenubarSubTrigger>
        {t("workbench_header_file_dropdown_insert_page")}
      </MenubarSubTrigger>
      <MenubarSubContent>
        <MenubarItem onClick={() => insertNewPage(0)}>
          {t("workbench_header_file_dropdown_insert_page_at_top")}
        </MenubarItem>
        <MenubarItem onClick={() => insertNewPage(getIndexOfPage(currentPage))}>
          {t("workbench_header_file_dropdown_insert_page_above")}
        </MenubarItem>
        <MenubarItem
          onClick={() => insertNewPage(getIndexOfPage(currentPage) + 1)}
        >
          {t("workbench_header_file_dropdown_insert_page_below")}
        </MenubarItem>
      </MenubarSubContent>
    </MenubarSub>
  );
}
