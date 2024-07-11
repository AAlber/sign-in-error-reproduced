import type { SurveyDialogProps } from "@/src/types/survey.types";
import { useSurveyDialog } from "./zustand";

export const initSurvey = ({ data }: { data: SurveyDialogProps }) => {
  const { setOpen, init } = useSurveyDialog.getState();
  setOpen(true);
  init(data);
};
