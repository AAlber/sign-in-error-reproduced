import { Download } from "lucide-react";
import { useState } from "react";
import { downloadFileFromUrl } from "@/src/client-functions/client-utils";
import Spinner from "@/src/components/spinner";
import type { InstitutionUserManagementUser } from "@/src/types/user-management.types";
import { Button } from "../../shadcn-ui/button";

export default function UserDocumentsDownloadButton({
  fileKey,
  user,
}: {
  fileKey: string;
  user: InstitutionUserManagementUser | null;
}) {
  const [isBeingDownloaded, setIsBeingDownloaded] = useState<boolean>(false);
  return (
    <Button
      variant="ghost"
      onClick={async () => {
        setIsBeingDownloaded(true);
        await downloadFileFromUrl(
          decodeURIComponent(
            fileKey.split("/").pop() || "User Document" + user?.name,
          ),
          process.env.NEXT_PUBLIC_WORKER_URL + "/" + fileKey,
        );
        setIsBeingDownloaded(false);
      }}
    >
      {isBeingDownloaded ? (
        <Spinner className="h-4 w-2" />
      ) : (
        <Download className="h-4 w-4" />
      )}
    </Button>
  );
}
