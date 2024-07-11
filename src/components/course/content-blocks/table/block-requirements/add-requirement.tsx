import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import { truncate } from "@/src/client-functions/client-utils";
import useCourse from "@/src/components/course/zustand";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import { toast } from "@/src/components/reusable/toaster/toast";
import type { ContentBlock } from "@/src/types/course.types";
import useContentBlockOverview from "../../block-overview/zustand";

type Props = {
  block: ContentBlock;
};

export default function AddRequirement({ block }: Props) {
  const { contentBlocks } = useCourse();
  const { setOpen } = useContentBlockOverview();
  const { t } = useTranslation("page");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"small"} variant="ghost" className="font-normal">
          <Plus className="ml-1 mr-1 h-4 w-4" />
          <span>{t("add")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="max-h-52 overflow-scroll"
        side="left"
        align="start"
        alignOffset={-10}
        sideOffset={-10}
      >
        {contentBlocks.map((req) => {
          const blockContentType =
            contentBlockHandler.get.registeredContentBlockByType(req.type);
          if (
            !blockContentType ||
            req.id === block.id ||
            block?.requirements?.some(({ id }) => id === req.id)
          ) {
            return null;
          }

          return (
            <DropdownMenuItem
              key={req.id}
              onClick={async () => {
                setTimeout(() => {
                  setOpen(false);
                }, 50);

                await contentBlockHandler.create
                  .requirement({
                    blockId: block.id,
                    requirementId: req.id,
                  })
                  .catch(() => {
                    toast.warning("toast_client_content_block_requirement1", {
                      description: "toast_client_content_block_requirement2",
                    });
                  });
              }}
              className="flex cursor-pointer items-center gap-1.5"
            >
              <span>{blockContentType.style.icon}</span>
              {truncate(req.name, 25)}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
