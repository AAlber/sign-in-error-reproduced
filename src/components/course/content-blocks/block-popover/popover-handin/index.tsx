import dayjs from "dayjs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FileDropField } from "@/src/components/reusable/file-uploaders/file-drop-field";
import useFileDrop from "@/src/components/reusable/file-uploaders/zustand";
import Skeleton from "@/src/components/skeleton";
import type { HandInSpecs } from "@/src/types/content-block/types/specs.types";
import type { ContentBlock } from "@/src/types/course.types";
import useUser from "@/src/zustand/user";
import BlockStatus from "../block-custom-popover-components/block-status";
import { GroupHandInButton } from "./group-handin";
import { HandInCommentSection } from "./handin-comment-section";
import { HandInFinishedButtons } from "./handin-finished-buttons";
import { HandInUploadButton } from "./handin-upload-button";
import { useHandInPopoverEffects } from "./hooks";
import { SharedHandInTrigger } from "./shared-handin-trigger";
import { useHandInDynamicPopover } from "./zustand";

type HandInPopoverProps = {
  block: ContentBlock;
};

export default function HandInPopover({ block }: HandInPopoverProps) {
  const { user } = useUser();
  const { handInUsers } = useHandInDynamicPopover();
  dayjs.locale(user.language);
  const { loading, fileUrl, fileExists } = useHandInPopoverEffects(block);
  const [changeFile, setChangeFile] = useState(false);
  const [comment, setComment] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const { uppy } = useFileDrop();
  const { t } = useTranslation("page");
  const blockSpecs = block.specs as unknown as HandInSpecs;

  const isUploadedByPeer = handInUsers.some(
    (u) => u.id === user.id && u.userData?.uploadedByPeer,
  );

  if (loading)
    return (
      <div className="flex h-36 w-full items-center justify-center rounded-sm border border-border">
        <Skeleton />
      </div>
    );

  if (!fileUrl || changeFile) {
    return (
      <div>
        {!isUploadedByPeer && <FileDropField showUploadButton={false} />}
        <div className="mt-2 flex w-full flex-col items-center gap-2">
          {!isUploadedByPeer && (
            <>
              <HandInCommentSection
                uploading={uploading}
                loading={loading}
                fileExists={fileExists}
                comment={comment}
                setComment={setComment}
              />
              <HandInUploadButton
                {...{
                  block,
                  fileUrl,
                  setChangeFile,
                  fileExists,
                  uploading,
                  setUploading,
                  uppy,
                  loading,
                  comment,
                }}
              />
            </>
          )}

          {blockSpecs.isGroupSubmission && !blockSpecs.isSharedSubmission && (
            <GroupHandInButton block={block} />
          )}

          {blockSpecs.isSharedSubmission && (
            <SharedHandInTrigger block={block} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {!changeFile && fileUrl && (
        <BlockStatus
          emoji="🎉"
          heading="hand_in_done"
          text="hand_in_done_description"
        />
      )}
      <HandInFinishedButtons fileUrl={fileUrl} setChangeFile={setChangeFile} />
    </div>
  );
}
