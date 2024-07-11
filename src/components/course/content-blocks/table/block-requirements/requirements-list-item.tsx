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
import type { ContentBlock } from "@/src/types/course.types";

type Props = {
  blockId: string;
  requirement: ContentBlock["requirements"][number];
  checked?: boolean;
};

export default function RequirementListItem({ blockId, requirement }: Props) {
  const { hasSpecialRole, course } = useCourse();
  const { t } = useTranslation("page");

  if (requirement.status !== "PUBLISHED" && !hasSpecialRole) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size={"small"}
          className="bg-accent/50 font-normal hover:bg-foreground"
        >
          {truncate(requirement?.name ?? "", 25)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => {
            setTimeout(() => {
              contentBlockHandler.zustand.openOverview(requirement.id);
            }, 50);
          }}
        >
          Open
        </DropdownMenuItem>
        {hasSpecialRole && (
          <DropdownMenuItem
            onClick={async () => {
              await contentBlockHandler.delete.requirement({
                blockId,
                requirementId: requirement.id,
              });
            }}
          >
            <span className="text-destructive">{t("general.delete")}</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
