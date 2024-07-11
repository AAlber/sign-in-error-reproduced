import { CheckSquare } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DropdownMenuItem } from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import useWorkbench from "../../zustand";
import { ElementType } from "../element-type";

export default function MenuItems(elementId: string) {
  const { updateElement, getElementsOfCurrentPage } = useWorkbench();
  const { t } = useTranslation("page");

  return (
    <DropdownMenuItem
      onClick={() => {
        const element = getElementsOfCurrentPage().find(
          (element) => element.id === elementId,
        );
        if (!element) return alert("Error: Element not found.");
        const updatedElement = {
          ...element,
          type: ElementType.MULTIPLE_CHOICE,
        };
        updateElement(elementId, updatedElement);
      }}
    >
      <CheckSquare
        className="mr-3 h-5 w-5 text-muted-contrast"
        aria-hidden="true"
      />
      {t("workbench.sidebar_element_single_choice_menu_item")}
    </DropdownMenuItem>
  );
}
