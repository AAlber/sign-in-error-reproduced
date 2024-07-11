import dayjs from "dayjs";
import { FolderPlusIcon } from "lucide-react";
import {
  useDrive,
  useDynamicDrive,
} from "@/src/client-functions/client-cloudflare/hooks";
import useUser from "@/src/zustand/user";
import { Button } from "../../reusable/shadcn-ui/button";

export function NewFolderButton() {
  const { user } = useUser();
  dayjs.locale(user.language);
  const { openedFolderId } = useDynamicDrive();
  const drive = useDrive();

  return (
    <Button
      variant={"ghost"}
      onClick={() => {
        drive.client.create.dummySubdirectory(
          openedFolderId === "" ? drive.utils.getBasePath() : openedFolderId,
        );
      }}
    >
      <FolderPlusIcon className="h-4 w-4" />
    </Button>
  );
}
