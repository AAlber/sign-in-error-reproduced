import dayjs from "dayjs";
import React from "react";
import { useTranslation } from "react-i18next";
import { replaceVariablesInString } from "@/src/client-functions/client-utils";
import type { RegisteredContentBlock } from "@/src/types/content-block/types/cb-types";
import type { ContentBlock } from "@/src/types/course.types";
import useCourse from "../../zustand";
import BlockMarkAsFinishedButton from "./block-custom-popover-components/block-mark-as-finished";
import BlockOpenButton from "./block-custom-popover-components/block-open-button";
import BlockStatus from "./block-custom-popover-components/block-status";

export const BlockPopoverContent = ({
  contentBlock,
  registeredContentBlock,
}: {
  contentBlock: ContentBlock;
  registeredContentBlock: RegisteredContentBlock;
}) => {
  const { t } = useTranslation("page");
  const { hasSpecialRole, isTestingMode } = useCourse();

  const notStarted = dayjs().isBefore(dayjs(contentBlock.startDate));
  const overDue = dayjs().isAfter(dayjs(contentBlock.dueDate));
  const canAccess =
    !notStarted &&
    !overDue &&
    (contentBlock.status === "PUBLISHED" || hasSpecialRole || isTestingMode);

  const PopoverComponent =
    registeredContentBlock.popoverSettings?.customContentComponent;

  return (
    <>
      <div className="flex flex-col gap-2 py-2 text-center">
        {!canAccess && (
          <div className="w-full">
            {contentBlock.status === "COMING_SOON" ? (
              <BlockStatus
                emoji="🕑"
                heading={t("coming_soon")}
                text="coming_soon_description"
              />
            ) : notStarted ? (
              <BlockStatus
                emoji="⏰"
                heading={replaceVariablesInString(t("block_not_started"), [
                  dayjs(contentBlock.startDate).fromNow(),
                ])}
                text="block_not_started_description"
              />
            ) : (
              <BlockStatus
                emoji="⌛"
                heading={replaceVariablesInString(t("block_end"), [
                  dayjs(contentBlock.dueDate).fromNow(),
                ])}
                text="block_end_description"
              />
            )}
          </div>
        )}
        {canAccess && (
          <div className="w-full">
            {/* Custom Component */}
            {PopoverComponent && <PopoverComponent block={contentBlock} />}

            {/* "Open" Button */}
            {registeredContentBlock.popoverSettings?.hasOpenButton && (
              <BlockOpenButton block={contentBlock} title="general.open" />
            )}
          </div>
        )}

        {/* "Mark as Finished" Button */}
        {contentBlock.userStatus !== "FINISHED" &&
          registeredContentBlock.popoverSettings?.hasMarkAsFinishedButton && (
            <BlockMarkAsFinishedButton block={contentBlock} />
          )}
      </div>
    </>
  );
};
