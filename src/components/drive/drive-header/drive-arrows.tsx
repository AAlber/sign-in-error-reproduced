import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useDrive,
  useDynamicDrive,
} from "@/src/client-functions/client-cloudflare/hooks";
import { getStringBeforeLastSlash } from "@/src/client-functions/client-cloudflare/utils";
import useUser from "@/src/zustand/user";
import { Button } from "../../reusable/shadcn-ui/button";

export function DriveArrows() {
  const { user } = useUser();
  dayjs.locale(user.language);
  const { openedFolderId, setOpenedFolderId, deepestLastFolderId } =
    useDynamicDrive();
  const drive = useDrive();
  const { getBasePath, getSubPath } = drive.utils;
  return (
    <>
      <Button
        disabled={openedFolderId === ""}
        variant={"ghost"}
        size={"icon"}
        onClick={() => {
          const previousIsRoot =
            getStringBeforeLastSlash(openedFolderId) === getBasePath();
          if (previousIsRoot) {
            setOpenedFolderId("");
          } else {
            setOpenedFolderId(getStringBeforeLastSlash(openedFolderId));
          }
        }}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant={"ghost"}
        size={"icon"}
        disabled={
          (openedFolderId === "" && deepestLastFolderId === "") ||
          openedFolderId === deepestLastFolderId
        }
        onClick={() => {
          setOpenedFolderId(
            (openedFolderId === "" ? getBasePath() : openedFolderId) +
              "/" +
              (openedFolderId === ""
                ? getSubPath(deepestLastFolderId)
                : getSubPath(deepestLastFolderId, openedFolderId)
              ).split("/")[0],
          );
        }}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </>
  );
}
