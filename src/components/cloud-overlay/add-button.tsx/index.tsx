import { Plus } from "lucide-react";
import { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import useInputModal from "../../popups/input-modal/zustand";
import useCloudOverlay from "../zustand";
import CloudAddItemAssessment from "./item-assessment";
import CloudAddItemFolder from "./item-folder";
import CloudAddItemLearning from "./item-learning";
import CloudAddItemScribble from "./item-scribble";

export default function CloudAddButton() {
  const { newFolderName, setNewFolderName, driveObject } = useCloudOverlay();
  const initNewFolderModal = useInputModal((state) => state.initModal);

  const { checkDirectoryExistsAlready, createNewFolder } = driveObject;

  useEffect(() => {
    if (newFolderName === "") return;
    if (checkDirectoryExistsAlready(newFolderName) !== undefined) {
      initNewFolderModal({
        title: `Folder called ${newFolderName} already exists.`,
        description: `Please use a different name to create a new folder.`,
        action: "Save",
        specialCharactersAllowed: false,
        name: "",
        onConfirm: (name) => {
          setNewFolderName(name);
        },
      });
    } else {
      createNewFolder(newFolderName);
      setNewFolderName("");
    }
  }, [newFolderName]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Plus
          data-testid="add-new-folder"
          className="mr-2 h-5 w-5 cursor-pointer text-black hover:opacity-60 dark:text-white"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="ml-5 w-[160px]  opacity-100 !shadow-none focus:outline-none "
      >
        <DropdownMenuGroup>
          <CloudAddItemFolder />
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-foreground" />

        <DropdownMenuGroup>
          <CloudAddItemScribble />
          <CloudAddItemLearning />
          <CloudAddItemAssessment />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
