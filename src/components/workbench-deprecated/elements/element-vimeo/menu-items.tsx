import { RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DropdownMenuItem } from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import useWorkbench from "../../zustand";
import { useVideoSelector } from "./zustand";

export default function MenuItems() {
  const { content } = useWorkbench();
  const { setOpenVideoSelector } = useVideoSelector();
  const { t } = useTranslation("page");

  return (
    <DropdownMenuItem onClick={() => setOpenVideoSelector(true)}>
      <RefreshCw
        className="mr-3 h-5 w-5 text-muted-contrast"
        aria-hidden="true"
      />
      {t("workbench.sidebar_element_video_menu_item")}
    </DropdownMenuItem>
  );
}
