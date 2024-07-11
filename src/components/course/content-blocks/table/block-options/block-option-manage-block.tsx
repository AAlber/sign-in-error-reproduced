import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import { DropdownMenuItem } from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import type { ContentBlock } from "@/src/types/course.types";

function BlockOptionManageBlock({ block }: { block: ContentBlock }) {
  const { t } = useTranslation("page");
  return (
    <DropdownMenuItem
      className="flex w-full cursor-pointer px-2"
      onClick={() => {
        contentBlockHandler.zustand.openOverview(block.id);
      }}
    >
      <ArrowUpRight className="mt-0.5 h-4 w-4" />
      <span className="text-sm">{t("general.open")}</span>
    </DropdownMenuItem>
  );
}

export default BlockOptionManageBlock;
