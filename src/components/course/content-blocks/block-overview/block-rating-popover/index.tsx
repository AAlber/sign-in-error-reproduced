import type { ContentBlockUserGrading } from "@prisma/client";
import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/reusable/shadcn-ui/popover";
import type { ContentBlockUserStatus } from "@/src/types/content-block/types/user-data.types";
import type { ContentBlock } from "@/src/types/course.types";
import { BlockPopoverContent } from "./content";

type Props = {
  rowUser: ContentBlockUserStatus;
  block: ContentBlock;
  onGraded: (userId: string, gradings: ContentBlockUserGrading) => void;
};

export const BlockRatingPopover = ({ rowUser, block, onGraded }: Props) => {
  const { t } = useTranslation("page");
  return (
    <Popover>
      <Button variant={"ghost"} size={"iconSm"} className="h-auto w-auto">
        <PopoverTrigger>
          {rowUser.rating ? rowUser.rating.ratingLabel : t("click_to_grade")}
        </PopoverTrigger>
      </Button>
      <PopoverContent>
        <BlockPopoverContent
          onGraded={onGraded}
          userId={rowUser.id}
          block={block}
        />
      </PopoverContent>
    </Popover>
  );
};
