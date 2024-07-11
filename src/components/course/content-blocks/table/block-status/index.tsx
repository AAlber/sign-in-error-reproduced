import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import type { ContentBlock } from "@/src/types/course.types";
import type { BlockStatus as BlockStatusType } from "@/src/utils/content-block-status";
import { blockStatus } from "@/src/utils/content-block-status";
import StatusItem from "./status-item";
import BlockStatusTrigger from "./status-trigger";

type Props = {
  block: ContentBlock;
  status: BlockStatusType;
};

export default function BlockStatus({ block, status }: Props) {
  const { t } = useTranslation("page");
  const visibleStatuses = blockStatus.filter((st) => st.visible);
  const invisibleStatuses = blockStatus.filter((st) => !st.visible);
  const draftBlock = block.status === "DRAFT" || block.status === "COMING_SOON";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <BlockStatusTrigger status={status} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="left"
        sideOffset={-15}
        alignOffset={-5}
      >
        <DropdownMenuLabel>
          {t("course_main_content_block_status_dropdown_visible_title")}
        </DropdownMenuLabel>

        {visibleStatuses
          .filter((st) => draftBlock || !st.isEditable)
          .map((st) => (
            <DropdownMenuItem key={st.identifier}>
              <StatusItem block={block} status={st} />
            </DropdownMenuItem>
          ))}

        <DropdownMenuSeparator />
        <DropdownMenuLabel>
          {t("course_main_content_block_status_dropdown_invisible_title")}
        </DropdownMenuLabel>

        {invisibleStatuses
          .filter((st) =>
            draftBlock ? st.identifier !== "DISABLED" : !st.isEditable,
          )
          .map((st) => (
            <DropdownMenuItem key={st.identifier}>
              <StatusItem block={block} status={st} />
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
