import { Check, ChevronsUpDownIcon, CornerRightUp } from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import classNames from "@/src/client-functions/client-utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
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

export default function NewRequirements({ block }: Props) {
  const [blocksAreLoading, contentBlocks] = useCourse((state) => [
    state.blocksAreLoading,
    state.contentBlocks,
  ]);

  const { t } = useTranslation("page");

  const options = {
    NON_DEPENDENT: t("beta_feature_linear-requirements_non-dependent"),
    DEPENDS_ON_PREV: t(
      "beta_feature_linear-requirements_dependes_on_previous_block",
    ),
    DEPENDS_ON_SPECIFIC_BLOCK: t(
      "beta_feature_linear-requirements_depends_on_specific_block",
    ),
  } as const;

  type OptionsKey = keyof typeof options;
  const requirementOptions = Object.entries(options).map((opt) => ({
    option: opt[0] as OptionsKey,
    label: opt[1],
  }));

  const [selected, setSelected] = useState<OptionsKey>(() => {
    /**
     * if requirement is undefined then NON_DEPENDENT,
     * elseif requirement is the previous block, then req dependsOnPrev
     * else DEPENDS_ON_SPECIFIC_BLOCK
     */
    const index = contentBlocks.findIndex((b) => b.id === block.id);
    const thisBlock = contentBlocks[index];
    if (!thisBlock) throw new Error("Missing block");

    const reqId = thisBlock.requirements[0]?.id;
    if (!reqId) return "NON_DEPENDENT";

    const blockBefore = contentBlocks[index - 1];

    if (!blockBefore) return "NON_DEPENDENT";
    if (blockBefore.type === "Section") return "NON_DEPENDENT";

    return blockBefore.id === reqId
      ? "DEPENDS_ON_PREV"
      : "DEPENDS_ON_SPECIFIC_BLOCK";
  });

  const handleSelect =
    (option: OptionsKey, isSelected: boolean, reqId: string) => () => {
      const sectionBLocks = contentBlocks.filter((b) => b.type === "Section");
      // checf if the reqId is inside the sectionBlocks
      if (sectionBLocks.some((b) => b.id === reqId)) {
        toast.warning(t("cb.requirements_section_toast_warn"), {
          description: t("cb.requirements_section_toast_warn_description"),
        });
        setSelected("NON_DEPENDENT");
        return;
      }

      if (isSelected) return;
      setSelected(option);

      const arg = {
        blockId: block.id,
        requirementId: reqId,
      };

      option === "NON_DEPENDENT"
        ? contentBlockHandler.delete.requirement(arg)
        : contentBlockHandler.create.requirement(arg);
    };

  const blockIndex = contentBlocks.findIndex((b) => b.id === block.id);
  const reqBlock = block.requirements[0];

  // firstBlock is the rootBlock, so we don't need to show block dependence DropDown trigger ui
  const isFirstBlock = block.position === 0 || blockIndex === 0;
  if (isFirstBlock) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={blocksAreLoading} asChild>
        <div
          className={classNames(
            blocksAreLoading
              ? "cursor-wait text-muted-contrast"
              : "cursor-pointer text-contrast opacity-100",
            "flex items-center justify-between hover:opacity-60",
          )}
        >
          {selected !== "NON_DEPENDENT" ? (
            <span className="flex items-center">
              <CornerRightUp className="mr-1 size-4 text-muted-contrast" />
              {options[selected]}
              {selected === "DEPENDS_ON_SPECIFIC_BLOCK"
                ? ` (${reqBlock?.name})`
                : ""}
            </span>
          ) : (
            <span className="flex items-center text-muted">
              {options[selected]}
            </span>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="left"
        sideOffset={-15}
        alignOffset={-5}
      >
        {requirementOptions.map(({ option, label }) => {
          const isSelected =
            option !== "DEPENDS_ON_SPECIFIC_BLOCK" && selected === option;
          const reqBlockId = reqBlock?.id ?? "";

          const prevBlock =
            contentBlocks[
              blockIndex !== -1 && !!blockIndex ? blockIndex - 1 : 0
            ];

          if (option === "DEPENDS_ON_SPECIFIC_BLOCK") {
            // if blockIndex < 2, means that it can only depend on contentBlock[0]
            if (blockIndex < 2) return null;
            return (
              <DropdownMenuSub key={option}>
                <DropdownMenuSubTrigger>
                  <span>{label}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {contentBlocks.map((req, index) =>
                      // linear requirements cannot depend on the next block
                      index > blockIndex || req.id === block.id ? null : (
                        <DropdownMenuItem
                          key={req.id}
                          className="cursor-pointer"
                          onClick={handleSelect(option, isSelected, req.id)}
                        >
                          {req.name}
                        </DropdownMenuItem>
                      ),
                    )}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            );
          }

          return (
            <DropdownMenuItem
              key={option}
              className="cursor-pointer"
              onClick={handleSelect(
                option,
                isSelected,
                option === "NON_DEPENDENT" ? reqBlockId : prevBlock?.id ?? "",
              )}
            >
              <span>{label}</span>{" "}
              {isSelected && <Check className="ml-5 size-4 text-contrast" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
