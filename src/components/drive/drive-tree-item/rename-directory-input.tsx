import React, { useEffect, useRef, useState } from "react";
import type { INode } from "react-accessible-treeview";
import { useTranslation } from "react-i18next";
import {
  useDrive,
  useDynamicDrive,
} from "@/src/client-functions/client-cloudflare/hooks";
import { getFileName } from "@/src/client-functions/client-cloudflare/utils";
import { delay } from "@/src/client-functions/client-utils";
import { Input } from "../../reusable/shadcn-ui/input";

export interface DriveTreeItemProps {
  element: INode<any>;
}

function RenameDirectoryInput({ element }: DriveTreeItemProps) {
  const { r2Objects } = useDynamicDrive();
  const drive = useDrive();
  const [directoryName, setDirectoryName] = useState(
    drive.utils.getDefaultNameForRenaming(element),
  );
  const { t } = useTranslation("page");
  useEffect(() => {
    setDirectoryName(drive.utils.getDefaultNameForRenaming(element));
  }, [r2Objects]);

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    delay(200).then(() => {
      if (inputRef.current) {
        const baseName = directoryName.replace(/\.[^/.]+$/, ""); // Removes the extension if present
        const selectionEnd = baseName.length; // End selection at the end of the base name
        inputRef.current.focus();
        inputRef.current.setSelectionRange(0, selectionEnd);
      }
    });
  }, []);
  const saveFunction = getFileName(element.id as string)?.startsWith(
    "-new-folder",
  )
    ? drive.api.saveNewFolder
    : drive.api.saveRenamedFolder;
  return (
    <div className="flex !w-[250px] items-center">
      <Input
        placeholder={t("enter-folder-name")}
        ref={inputRef}
        className="!w-full cursor-text text-ellipsis !border-transparent !bg-transparent !p-0 placeholder:!w-[300px] focus:!border-transparent "
        value={directoryName}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            saveFunction(element, directoryName);
          } else if (e.key === "Escape") {
            setDirectoryName("");
            setTimeout(() => {
              saveFunction(element, directoryName);
            }, 50);
          }
        }}
        onChange={(e) => {
          setDirectoryName(e.target.value as string);
        }}
        onBlur={(e) => saveFunction(element, directoryName)}
      />
    </div>
  );
}

export default React.memo(RenameDirectoryInput);
