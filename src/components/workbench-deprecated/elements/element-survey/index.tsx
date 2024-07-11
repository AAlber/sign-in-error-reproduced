import cuid from "cuid";
import type { WorkbenchElementType } from "../element-type";
import { ElementBehaviourType, ElementType } from "../element-type";
import { ElementBody } from "./element-body";
import { ElementIcon, ElementIconSmall } from "./element-icons";

export type SurveyMetadata = {
  evaluated: boolean;
  questions: SurveyQuestion[];
  logics: SurveyLogic[];
};

export type SurveyQuestion = {
  id: string;
  question: string;
  choices: SurveyChoice[];
};

export type SurveyChoice = {
  choice: string;
  checked: boolean;
  points: number;
};

export type SurveyLogic = {
  id: string;
  threshold: number;
  threshold2?: number;
  condition: "greater than" | "less than" | "equal to" | "within range";
  actionType: "download file" | "open link" | "unlock content";
  actionLink: string;
  fileName?: string;
};

export const survey: WorkbenchElementType = {
  id: ElementType.QUESTIONAIRE,
  name: "workbench.sidebar_element_survey",
  icon: ElementIcon(),
  iconSmall: ElementIconSmall(),
  behaviourType: ElementBehaviourType.AUTOMATION,
  defaultMetadata: {
    evaluated: false,
    questions: [
      {
        id: cuid(),
        question: "",
        choices: [
          { choice: "", checked: false, points: 0 },
          { choice: "", checked: false, points: 0 },
        ],
      },
    ],
    logics: [],
  } as SurveyMetadata,
  exampleForUser: "",
  exampleForAI: [],
  component: (elementId) => ElementBody(elementId),
};
