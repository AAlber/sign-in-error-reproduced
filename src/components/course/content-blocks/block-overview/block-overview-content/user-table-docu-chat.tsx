import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import { getDocuChatThreadForSpecificUser } from "@/src/client-functions/client-docu-chat";
import { replaceVariablesInString } from "@/src/client-functions/client-utils";
import useDocuChat from "@/src/components/popups/docu-chat/zustand";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import type { ContentBlockUserStatus } from "@/src/types/content-block/types/user-data.types";
import type { ContentBlock } from "@/src/types/course.types";
import ContentBlockUserTable from "./content-block-user-table";

export default function UserTableDocuChat({ block }: { block: ContentBlock }) {
  const { t } = useTranslation("page");
  const { openChat } = useDocuChat.getState();
  const [loadingUsers, setLoadingUsers] = useState<string[]>([]);

  const columns: ColumnDef<ContentBlockUserStatus<"DocuChat">>[] = [
    {
      id: "messages",
      header: t("messages"),
      cell: ({ row }) => (
        <p className="whitespace-nowrap text-sm text-muted-contrast">
          {row.original.userData
            ? replaceVariablesInString(t("x-messages"), [
                row.original.userData.messageCount,
              ])
            : t("no-messages")}
        </p>
      ),
    },
    {
      id: "view",
      header: "",
      cell: ({ row }) => (
        <>
          {row.original.userData ? (
            <Button
              variant={"link"}
              disabled={loadingUsers.includes(row.original.id)}
              onClick={async () => {
                setLoadingUsers([...loadingUsers, row.original.id]);
                const data = await getDocuChatThreadForSpecificUser(
                  block.id,
                  row.original.id,
                );
                setLoadingUsers(
                  loadingUsers.filter((id) => id !== row.original.id),
                );
                openChat({
                  block: block as any,
                  messages: data.messages,
                  mode: "view",
                  user: row.original,
                  userStatus: {
                    status: "IN_PROGRESS",
                    userData: {
                      threadId: data.threadId,
                      messageCount: data.messages.length,
                    },
                  },
                });
              }}
            >
              {t(
                loadingUsers.includes(row.original.id)
                  ? "general.loading"
                  : "general.view",
              )}
            </Button>
          ) : (
            <></>
          )}
        </>
      ),
    },
  ];

  return (
    <ContentBlockUserTable
      block={block}
      fetchData={() =>
        contentBlockHandler.userStatus.getForBlock<"DocuChat">(block.id, true)
      }
      additionalColumns={columns}
    />
  );
}
