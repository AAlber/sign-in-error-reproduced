import cuid from "cuid";
import { Copy } from "lucide-react";
import { DropdownMenuItem } from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import { toast } from "@/src/components/reusable/toaster/toast";
import elementTypes from "../../elements/element-types";
import useWorkbench from "../../zustand";

export default function ElementOptionsDuplicate({ elementId }) {
  const { getElementsOfCurrentPage } = useWorkbench();
  const element = getElementsOfCurrentPage().find((e) => e.id === elementId);

  return (
    <DropdownMenuItem onClick={async () => duplicate({ element })}>
      <Copy className="mr-3 h-5 w-5 text-muted-contrast" aria-hidden="true" />
      Duplicate
    </DropdownMenuItem>
  );
}

async function duplicate({ element }): Promise<void> {
  const { addElementAt, getElementsOfCurrentPage } = useWorkbench.getState();
  if (!element) return;
  const taskTypeId = element.type;
  const taskType = elementTypes.find((e) => e.id === taskTypeId);
  const targetIndex = getElementsOfCurrentPage().indexOf(element) + 1;
  if (!taskType) return;
  try {
    addElementAt(
      {
        id: cuid(),
        type: taskType!.id,
        metadata: element.metadata,
      },
      targetIndex,
    );
  } catch (error) {
    console.log(error);
    toast.error("toast.workbench_duplicate_element_error", {
      description: "toast.workbench_duplicate_element_error_description",
    });
  }
}
