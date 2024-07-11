import { useTranslation } from "react-i18next";
import { MenubarItem } from "@/src/components/reusable/shadcn-ui/menubar";
import useWorkbench from "../../zustand";

export default function WBMenuItemNewPage() {
  const { addPage } = useWorkbench();
  const { t } = useTranslation("page");

  return (
    <MenubarItem onClick={addPage}>
      {t("workbench_header_file_dropdown_new_page")}
    </MenubarItem>
  );
}
