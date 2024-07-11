import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import TruncateHover from "@/src/components/reusable/truncate-hover";
import type { ContentBlock } from "@/src/types/course.types";
import useUser from "@/src/zustand/user";
import { useHandInDynamicPopover } from "../zustand";

export const HandInUsersButton = ({ block }: { block: ContentBlock }) => {
  const { user } = useUser();
  const { t } = useTranslation("page");
  const { handInUsers, setLoading, setBlocksChanged } =
    useHandInDynamicPopover();

  return (
    <div className="flex w-full items-center gap-1">
      <Button className="flex w-full items-center gap-1">
        <TruncateHover
          text={
            t("course_main_content_block_hand_in.upload_by_peer_user") +
            " " +
            handInUsers.find((u) => u.userData?.uploadedByPeer)?.userData
              ?.uploadedByPeer
          }
          truncateAt={31}
        />

        <p className="text-muted-contrast">| </p>
        <Button
          variant={"ghost"}
          size={"iconSm"}
          onClick={async () => {
            setLoading(true);

            // Use optional chaining safely without the non-null assertion.
            const userData = handInUsers.find((u) => u.userData?.uploadedByPeer)
              ?.userData;

            if (userData) {
              // Check if userData is defined
              await contentBlockHandler.userStatus.update<"HandIn">({
                blockId: block.id,
                data: {
                  status: "IN_PROGRESS",
                  userData: {
                    ...userData,
                    uploadedAt: undefined,
                    url: "",
                    uploadedByPeer: "",
                    peerUserId: "",
                  },
                },
                userId: user.id,
              });
            } else {
              // Handle the case where userData is undefined, e.g., show an error message.
              console.error("User data is undefined.");
            }

            setBlocksChanged(true);
            setLoading(false);
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </Button>
    </div>
  );
};
