import { useTranslation } from "react-i18next";
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import type { ContentBlock } from "@/src/types/course.types";
import { blockStatus } from "@/src/utils/content-block-status";
import StatusItem from "../../block-status/status-item";
import StatusTitle from "./status-title";

type Props = { block: ContentBlock };

export default function BlockOptionSetStatus({ block }: Props) {
  const { t } = useTranslation("page");
  const activeStatus = blockStatus.find(
    (status) => status.identifier === block.status,
  );

  const visibleStatuses = blockStatus.filter((status) => status.visible);
  const invisibleStatuses = blockStatus.filter((status) => !status.visible);
  const draftBlock = block.status === "DRAFT" || block.status === "COMING_SOON";

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <StatusTitle activeStatusColor={activeStatus?.color ?? ""} />
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuLabel className="flex flex-col text-sm text-contrast">
            {t("course_main_content_block_status_dropdown_visible_title")}
          </DropdownMenuLabel>

          {visibleStatuses
            .filter((status) => draftBlock || !status.isEditable)
            .map((status) => (
              <DropdownMenuItem key={status.identifier}>
                <StatusItem block={block} status={status} />
              </DropdownMenuItem>
            ))}

          <DropdownMenuSeparator />
          <DropdownMenuLabel className="flex flex-col text-sm text-contrast">
            {t("course_main_content_block_status_dropdown_invisible_title")}
          </DropdownMenuLabel>

          {invisibleStatuses
            .filter((status) =>
              draftBlock
                ? status.identifier !== "DISABLED"
                : !status.isEditable,
            )
            .map((status) => (
              <DropdownMenuItem key={status.identifier}>
                <StatusItem block={block} status={status} />
              </DropdownMenuItem>
            ))}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}
