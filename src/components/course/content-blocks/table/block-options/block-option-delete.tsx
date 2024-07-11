import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import confirmAction from "@/src/client-functions/client-options-modal";
import { DropdownMenuItem } from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import type { ContentBlock } from "@/src/types/course.types";

type Props = {
  block: ContentBlock;
};

export default function BlockOptionDelete({ block }: Props) {
  const { t } = useTranslation("page");

  return (
    <DropdownMenuItem
      data-testid="button-option-block-delete"
      className="flex w-full cursor-pointer px-2"
      onClick={() =>
        confirmAction(() => contentBlockHandler.delete.block(block.id), {
          title: t("general.delete") + " " + block.name,
          description:
            block.type === "HandIn"
              ? "course.confirm_action_delete_handin_description"
              : "course.confirm_action_delete_block_description",
          actionName: "general.delete",
          dangerousAction: true,
        })
      }
    >
      <Trash2 className="mt-0.5 h-4 w-4 text-destructive" />
      <span className="text-sm text-destructive">{t("general.delete")}</span>
    </DropdownMenuItem>
  );
}
