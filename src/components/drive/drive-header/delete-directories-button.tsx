import dayjs from "dayjs";
import { Trash } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  useDrive,
  useDynamicDrive,
} from "@/src/client-functions/client-cloudflare/hooks";
import useUser from "@/src/zustand/user";
import { Button } from "../../reusable/shadcn-ui/button";

export function DeleteDirectoriesButton() {
  const { user } = useUser();
  dayjs.locale(user.language);

  const { selectedIds } = useDynamicDrive();
  const drive = useDrive();
  const { t } = useTranslation("page");
  return (
    <Button
      variant={"ghost"}
      disabled={selectedIds.length === 0}
      onClick={async () => {
        drive.client.confirm.deleteDirectory(t);
      }}
    >
      <Trash className="h-4 w-4" />
    </Button>
  );
}
