import { ChevronDown, Download, Link, Unlock } from "lucide-react";
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

export default function ActionTypeSelector({
  elementId,
  logic,
}: {
  elementId: string;
  logic: SurveyLogic;
}) {
  const { t } = useTranslation("page");
  const actionTranslation = {
    "open link": t("workbench.sidebar_element_survey_logic_action_open_link"),
    "download file": t(
      "workbench.sidebar_element_survey_logic_action_download",
    ),
    "unlock content": t("workbench.sidebar_element_survey_logic_action_unlock"),
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex items-center gap-2 rounded-md border border-border bg-background px-2 py-1 font-medium text-contrast">
          {t(actionTranslation[logic.actionType])}
          <ChevronDown className="h-4 w-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-5 w-[150px] opacity-100 !shadow-none ring-1 ring-black ring-opacity-5 focus:outline-none ">
        <DropdownMenuGroup>
          <DropdownMenuItem
            data-testid="button-option-create-invite"
            className="flex w-full gap-2 px-2 text-sm "
            onClick={() =>
              updateLogics(elementId, logic.id, { actionType: "open link" })
            }
          >
            <Link className="h-4 w-4" />
            {t("workbench.sidebar_element_survey_logic_action_open_link")}
          </DropdownMenuItem>
          <DropdownMenuItem
            data-testid="button-option-create-invite"
            className="flex w-full gap-2 px-2 text-sm "
            onClick={() =>
              updateLogics(elementId, logic.id, { actionType: "download file" })
            }
          >
            <Download className="h-4 w-4" />
            {t("workbench.sidebar_element_survey_logic_action_download")}
          </DropdownMenuItem>
          <DropdownMenuItem
            data-testid="button-option-create-invite"
            className="flex w-full gap-2 px-2 text-sm "
            onClick={() =>
              updateLogics(elementId, logic.id, {
                actionType: "unlock content",
              })
            }
          >
            <Unlock className="h-4 w-4" />
            {t("workbench.sidebar_element_survey_logic_action_unlock")}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
