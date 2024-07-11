import { Download } from "lucide-react";
import { DropdownMenuItem } from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import { downloadFileFromUrl } from "../../../../client-functions/client-utils";
import useWorkbench from "../../zustand";

export default function MenuItems(elementId: string) {
  const { content, getElementsOfCurrentPage } = useWorkbench();

  return (
    <DropdownMenuItem
      onClick={() => {
        const element = getElementsOfCurrentPage().find(
          (element) => element.id === elementId,
        );
        if (!element || !element.metadata.imageUrl)
          return alert("Please select a valid image first.");
        downloadFileFromUrl("element-image.png", element.metadata.imageUrl);
      }}
    >
      <Download
        className="mr-3 h-5 w-5 dark:text-muted-contrast"
        aria-hidden="true"
      />
      Download Image
    </DropdownMenuItem>
  );
}
