import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import WithToolTip from "@/src/components/reusable/with-tooltip";
import type { ContentBlock } from "@/src/types/course.types";
import useCourse from "../../../zustand";
import BlockMarkAsFinishedButton from "./block-mark-as-finished";

export const BlockExternalDeliverablePopOver = ({
  block,
}: {
  block: ContentBlock;
}) => {
  const { t } = useTranslation("page");
  const { hasSpecialRole } = useCourse();

  const setInProgess = async () => {
    await contentBlockHandler.userStatus.update({
      blockId: block.id,
      data: {
        status: "IN_PROGRESS",
        userData: {} as any,
      },
    });
  };

  useEffect(() => {
    if (block.userStatus !== "FINISHED") setInProgess();
  }, []);

  const isFinishable = block.specs.studentCanMarkAsFinished;

  const renderButtonWithOptionalTooltip = () => {
    const button = (
      <BlockMarkAsFinishedButton
        block={block}
        onFinish={async () => {
          await contentBlockHandler.userStatus.update({
            blockId: block.id,
            data: {
              status: "FINISHED",
              userData: {
                markedAsFinishedDate: new Date(),
              },
            },
          });
        }}
      />
    );

    if (hasSpecialRole) {
      return (
        <WithToolTip
          text="content_block.external_content.educators_tip"
          disabled={isFinishable}
        >
          {button}
        </WithToolTip>
      );
    }

    return button;
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted-contrast">
        {isFinishable
          ? t("content_block.external_content.popover_text")
          : t("content_block.external_content.waiting_for_finish")}{" "}
      </p>
      {isFinishable || hasSpecialRole
        ? renderButtonWithOptionalTooltip()
        : null}
    </div>
  );
};
