import Link from "next/link";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import type { ContentBlock } from "@/src/types/course.types";
import BlockMarkAsFinishedButton from "./block-mark-as-finished";

export const BlockLinkButtons = ({ block }: { block: ContentBlock }) => {
  const { t } = useTranslation("page");

  return (
    <div className="flex flex-col gap-2">
      <Link href={block.specs.url} target="_blank" className="h-full w-full">
        <Button
          onClick={async () => {
            await contentBlockHandler.userStatus.update({
              blockId: block.id,
              data: {
                status: "IN_PROGRESS",
                userData: {
                  lastViewed: new Date(),
                },
              },
            });
          }}
          variant={"cta"}
          className="w-full"
        >
          {t("content_block_link.visit", {
            link: new URL(block.specs.url).hostname,
          })}
        </Button>
      </Link>

      <BlockMarkAsFinishedButton block={block} />
    </div>
  );
};
