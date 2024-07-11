import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import {
  replaceVariablesInString,
  truncate,
} from "@/src/client-functions/client-utils";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import type { ContentBlock } from "@/src/types/course.types";
import useCourse from "../../../zustand";

type Props = {
  block: ContentBlock;
};

export default function RequirementListMultiItemsIndicator({ block }: Props) {
  const { t } = useTranslation("page");
  const { course } = useCourse();

  const requirements = block.requirements;
  const firstRequirement = requirements[0];
  if (!firstRequirement) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size={"small"}
          className="bg-accent/50 font-normal hover:bg-foreground"
        >
          {truncate(firstRequirement.name ?? "", 25)} +{" "}
          {replaceVariablesInString(t("x-more"), [requirements.length - 1])}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {requirements.map(({ id, name }) => (
          <DropdownMenuSub key={id}>
            <DropdownMenuSubTrigger>
              {truncate(name ?? "", 30)}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  setTimeout(() => {
                    contentBlockHandler.zustand.openOverview(id);
                  }, 50);
                }}
              >
                Open
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={async () => {
                  await contentBlockHandler.delete.requirement({
                    blockId: block.id,
                    requirementId: id,
                  });
                }}
              >
                <span className="text-destructive">{t("general.delete")}</span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
