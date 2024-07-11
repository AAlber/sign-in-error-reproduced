import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import type { ContentBlock } from "@/src/types/course.types";
import useUser from "@/src/zustand/user";
import { useHandInDynamicPopover } from "../zustand";
import { HandInUserSelection } from "./user-selection";
import { HandInUsersButton } from "./users-button";

export const GroupHandInButton = ({ block }: { block: ContentBlock }) => {
  const { user } = useUser();
  const { t } = useTranslation("page");
  const {
    handInUsers,
    setHandInUsers,
    loading,
    setLoading,
    blocksChanged,
    setBlocksChanged,
  } = useHandInDynamicPopover();
  const fetchHandInUsers = async () => {
    const users = await contentBlockHandler.userStatus.getForBlock<"HandIn">(
      block.id,
      true,
    );
    console.log("users", users);
    setHandInUsers(users);
    setBlocksChanged(false);
    setLoading(false);
  };

  useEffect(() => {
    fetchHandInUsers();
  }, [blocksChanged === true]);

  const isUploadedByPeer = handInUsers.some(
    (u) => u.id === user.id && u.userData?.uploadedByPeer,
  );

  return (
    <div className="w-full">
      {loading ? (
        <p className="text-sm text-muted-contrast">{t("general.loading")}</p>
      ) : (
        <>
          {!isUploadedByPeer && <HandInUserSelection block={block} />}
          {isUploadedByPeer && <HandInUsersButton block={block} />}
        </>
      )}
    </div>
  );
};
