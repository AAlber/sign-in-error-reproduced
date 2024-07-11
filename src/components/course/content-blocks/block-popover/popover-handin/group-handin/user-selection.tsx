import { FileX } from "lucide-react";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import { truncate } from "@/src/client-functions/client-utils";
import AsyncSelect from "@/src/components/reusable/async-select";
import { EmptyState } from "@/src/components/reusable/empty-state/empty-state";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import UserDefaultImage from "@/src/components/user-default-image";
import type { ContentBlockUserStatus } from "@/src/types/content-block/types/user-data.types";
import type { ContentBlock } from "@/src/types/course.types";
import useUser from "@/src/zustand/user";
import { useHandInDynamicPopover } from "../zustand";

export const HandInUserSelection = ({ block }: { block: ContentBlock }) => {
  const { handInUsers, setLoading, setBlocksChanged } =
    useHandInDynamicPopover();
  const { user } = useUser();
  const userHadUpload = handInUsers.some(
    (u) => u.id === user.id && u.userData?.url,
  );
  const { t } = useTranslation("page");

  return (
    <AsyncSelect
      side="top"
      fetchData={() =>
        contentBlockHandler.userStatus
          .getForBlock<"HandIn">(block.id, true)
          .then((users) =>
            users.filter((u) => u.id !== user.id && u.status === "FINISHED"),
          ) as Promise<ContentBlockUserStatus<"HandIn">[]>
      }
      itemComponent={(item) => (
        <div className="flex items-center gap-4">
          <UserDefaultImage user={item} dimensions={"h-6 w-6"} />
          {truncate(item.name, 30)}
        </div>
      )}
      emptyState={
        <EmptyState
          className="p-4"
          icon={FileX}
          title="shared.handin.empty.title"
          description="shared.handin.empty.description"
        />
      }
      onSelect={async (item) => {
        setLoading(true);
        await contentBlockHandler.userStatus.update<"HandIn">({
          blockId: block.id,
          data: {
            status: "FINISHED",
            userData: {
              url: "",
              uploadedAt: new Date(),
              comment: item.userData!.comment!,
              uploadedByPeer: item.name,
              peerUserId: item.id,
            },
          },
          userId: user.id,
        });
        setBlocksChanged(true);
        setLoading(false);
      }}
      placeholder="general.search"
      searchValue={(item) => item.name}
      trigger={
        <Button disabled={userHadUpload} className="w-full">
          <p>{t("course_main_content_block_hand_in.upload_by_peer")}</p>
        </Button>
      }
      refreshTrigger={block.id}
      noDataMessage="hand_in.user_selection_no_data"
    />
  );
};
