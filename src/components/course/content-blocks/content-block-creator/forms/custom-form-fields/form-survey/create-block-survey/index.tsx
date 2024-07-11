import { HelpCircle, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/reusable/shadcn-ui/popover";
import WithToolTip from "@/src/components/reusable/with-tooltip";
import useCustomFormSurvey from "../zustand";
import { SurveyAddButton } from "./add-button";
import SurveyPopoverAwnsersList from "./answers-list";
import { QuestionTextArea } from "./question-text-area";
import { QuestionTypeSwitch } from "./question-type-switch";
import useSurveyCreation from "./zustand";

const CreateBlockSurveyPopover = () => {
  const { t } = useTranslation("page");
  const { setOpen, open } = useCustomFormSurvey();
  const { questionType } = useSurveyCreation();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger onClick={() => setOpen(true)}>
        <Button variant={"ghost"}>
          <Plus className=" mr-1 h-4 w-4" />
          {t("add")}
        </Button>
      </PopoverTrigger>
      <PopoverContent side="right" asChild>
        <div className="relative z-50 flex flex-col gap-2">
          <h2>{t("cb.survey_table.question")}</h2>
          <QuestionTextArea />
          <div className="mt-2 flex justify-between">
            <div className="flex items-center gap-2">
              <h3>{t("cb.survey_table.awnser_selection")}</h3>
              <WithToolTip text="cb.survey_table.awnser_selection_helphover">
                <HelpCircle className="h-4 w-4 text-contrast" />
              </WithToolTip>
            </div>
            <QuestionTypeSwitch />
          </div>
          {questionType === "selection" && <SurveyPopoverAwnsersList />}
          <SurveyAddButton />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CreateBlockSurveyPopover;
