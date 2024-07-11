import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsRightLeft,
  Equal,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import type { SurveyLogic } from "../..";
import { updateLogics } from "../functions";

export default function ConditionSelector({
  elementId,
  logic,
}: {
  elementId: string;
  logic: SurveyLogic;
}) {
  const { t } = useTranslation("page");

  const conditionTranslation = {
    "equal to": t("workbench.sidebar_element_survey_logic_condition_equal"),
    "within range": t(
      "workbench.sidebar_element_survey_logic_condition_within",
    ),
    "less than": t("workbench.sidebar_element_survey_logic_condition_less"),
    "greater than": t(
      "workbench.sidebar_element_survey_logic_condition_greater",
    ),
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex items-center gap-2 rounded-md border border-border bg-background px-2 py-1 font-medium text-contrast ">
          {t(conditionTranslation[logic.condition])}
          <ChevronDown className="h-4 w-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-5 w-[150px] border-border bg-background opacity-100 !shadow-none ring-1 ring-black ring-opacity-5 focus:outline-none ">
        <DropdownMenuGroup>
          <DropdownMenuItem
            data-testid="button-option-create-invite"
            className="flex w-full gap-2 px-2 text-sm "
            onClick={() =>
              updateLogics(elementId, logic.id, { condition: "greater than" })
            }
          >
            <ChevronRight className="h-4 w-4" />
            {t("workbench.sidebar_element_survey_logic_condition_greater")}
          </DropdownMenuItem>
          <DropdownMenuItem
            data-testid="button-option-create-invite"
            className="flex w-full gap-2 px-2 text-sm "
            onClick={() =>
              updateLogics(elementId, logic.id, { condition: "less than" })
            }
          >
            <ChevronLeft className="h-4 w-4" />
            {t("workbench.sidebar_element_survey_logic_condition_less")}
          </DropdownMenuItem>
          <DropdownMenuItem
            data-testid="button-option-create-invite"
            className="flex w-full gap-2 px-2 text-sm "
            onClick={() =>
              updateLogics(elementId, logic.id, { condition: "equal to" })
            }
          >
            <Equal className="h-4 w-4" />
            {t("workbench.sidebar_element_survey_logic_condition_equal")}
          </DropdownMenuItem>
          <DropdownMenuItem
            data-testid="button-option-create-invite"
            className="flex w-full gap-2 px-2 text-sm "
            onClick={() =>
              updateLogics(elementId, logic.id, { condition: "within range" })
            }
          >
            <ChevronsRightLeft className="h-4 w-4" />
            {t("workbench.sidebar_element_survey_logic_condition_within")}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
