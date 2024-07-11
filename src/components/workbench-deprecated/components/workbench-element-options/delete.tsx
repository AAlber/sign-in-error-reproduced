import { Trash2 } from "lucide-react";
import { DropdownMenuItem } from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import useWorkbench from "../../zustand";

export default function ElementOptionsDelete({ elementId }) {
  const { removeElement } = useWorkbench();

  return (
    <DropdownMenuItem onClick={() => removeElement(elementId)}>
      <Trash2 className="mr-3 h-5 w-5 text-muted-contrast" aria-hidden="true" />
      Delete
    </DropdownMenuItem>
  );
}
