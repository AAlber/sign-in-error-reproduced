import { Folder } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DropdownMenuItem } from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import useInputModal from "../../popups/input-modal/zustand";
import useCloudOverlay from "../zustand";

export default function CloudAddItemFolder() {
  const { driveObject, setNewFolderName } = useCloudOverlay();
  const initNewFolderModal = useInputModal((state) => state.initModal);
  const { t } = useTranslation("page");
  // const [newFolderName, setNewFolderName] = useState("")
  // const userId = useUser().user?.id;

  const { isFolder, currentFiles } = driveObject;

  const checkFolderExistsAlready = (name: string) => {
    for (const file of currentFiles) {
      if (file.name === name && isFolder(file)) {
        return true;
      }
    }
    return false;
  };

  return (
    <DropdownMenuItem
      onClick={() =>
        initNewFolderModal({
          title: "Create a New Folder",
          description: `What would you like to name the folder?`,
          action: "Save",
          specialCharactersAllowed: false,
          name: "",
          onConfirm: (name) => {
            // const folderExistsAlready = checkFolderExistsAlready(name)
            // if (!folderExistsAlready) createNewFolder(name)
            // else {
            setNewFolderName(name);
          },
          // },
        })
      }
      className="px-2] flex w-full"
    >
      <Folder className="mr-3 h-4 w-4 text-muted-contrast" />
      <span className="text-sm text-contrast">{t("cloud.create_folder")}</span>
    </DropdownMenuItem>
  );
}
