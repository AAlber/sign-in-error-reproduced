import { X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { deleteCloudflareDirectories } from "@/src/client-functions/client-cloudflare";
import confirmAction from "@/src/client-functions/client-options-modal";
import { replaceVariablesInString } from "@/src/client-functions/client-utils";
import Spinner from "@/src/components/spinner";
import type { ReducedR2ObjectWithName } from "@/src/types/storage.types";
import { Button } from "../../shadcn-ui/button";

export default function UserDocumentsDeleteButton({
  fileKey,
  userDocuments,
  setUserDocuments,
}: {
  fileKey: string;
  userDocuments: ReducedR2ObjectWithName[];
  setUserDocuments: (userDocuments: ReducedR2ObjectWithName[]) => void;
}) {
  const [isBeingDeleted, setIsBeingDeleted] = useState<boolean>(false);
  const { t } = useTranslation("page");
  return (
    <Button
      variant="ghost"
      onClick={async () => {
        confirmAction(
          async () => {
            setIsBeingDeleted(true);
            await deleteCloudflareDirectories([
              {
                url: process.env.NEXT_PUBLIC_WORKER_URL + "/" + fileKey,
                isFolder: false,
              },
            ]);
            setUserDocuments(userDocuments.filter((d) => d.Key !== fileKey));
            setIsBeingDeleted(false);
          },
          {
            title: "delete_document",
            description: replaceVariablesInString(
              t("delete_document_description"),
              [fileKey.split("/").pop()],
            ),
            actionName: "general.delete",
            dangerousAction: true,
            allowCancel: true,
          },
        );
      }}
    >
      {isBeingDeleted ? (
        <Spinner className="h-4 w-2" />
      ) : (
        <X className="h-4 w-4" />
      )}
    </Button>
  );
}
