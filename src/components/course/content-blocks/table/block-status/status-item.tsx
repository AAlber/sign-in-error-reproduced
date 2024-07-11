import { Check } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import confirmAction from "@/src/client-functions/client-options-modal";
import type { ContentBlock } from "@/src/types/course.types";
import type { BlockStatusType } from "@/src/utils/content-block-status";

type Props = {
  status: BlockStatusType;
  block: ContentBlock;
} & React.ComponentPropsWithoutRef<"button">;

export default function StatusItem({ status, block }: Props) {
  const { t } = useTranslation("page");
  const draftBlock = block.status === "DRAFT" || block.status === "COMING_SOON";

  const handleClick = () => {
    if (
      draftBlock &&
      (status.identifier === "PUBLISHED" || status.identifier === "DISABLED")
    ) {
      const title = t(
        "course_main_content_block_status_publish_confirmation_title",
      );

      const description = t(
        "course_main_content_block_status_publish_confirmation_description",
      );

      confirmAction(
        () =>
          contentBlockHandler.update.block({
            id: block.id,
            status: status.identifier,
          }),
        {
          title,
          description,
          actionName: t("general.confirm"),
        },
      );
    } else {
      contentBlockHandler.update.block({
        id: block.id,
        status: status.identifier,
      });
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex w-full items-center justify-between text-sm"
    >
      <div className="flex items-center">
        <div className="mr-2 flex h-4 w-4 items-center justify-center">
          <div className={`h-2 w-2 rounded-full ${status.color}`} />
        </div>
        <span>{t(status.name)}</span>
      </div>
      {block.status === status.identifier && (
        <Check className="ml-5 h-4 w-4 text-contrast" />
      )}
    </button>
  );
}
