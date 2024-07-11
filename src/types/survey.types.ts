export type SurveySpecs = {
  questions: SurveyQuestion[];
  // later used to show the teacher who answered or not.
  isAnonymous: boolean;
};

// store these types in src/types/survey.types.ts
// we maybe use them somewhere else in the project sometimes.
type SurveyQuestionBase = {
  id: string;
  question: string;
};

export type SelectionQuestion = SurveyQuestionBase & {
  type: "selection";
  options: SelectionOption[];
};

export type SelectionOption = {
  id: string;
  text: string;
};

export type TextQuestion = SurveyQuestionBase & {
  type: "text";
};

export type InputQuestion = SurveyQuestionBase & {
  type: "input";
};

export type SurveyQuestion = SelectionQuestion | TextQuestion;

export type SurveyAnswer = SurveyTextAnswer | SurveySelectionAnswer;

type SurveySelectionAnswer = {
  type: "selection";
  questionId: string;
  answerId: string;
};

export type SurveyTextAnswer = {
  type: "text";
  questionId: string;
  answer: string;
};

export type SurveyDialogProps = {
  questions: SurveyQuestion[];
  onFinish: (answers: SurveyAnswer[]) => void | Promise<void>;
  confirmationText: string;
  answers?: SurveyAnswer[];
  mode: "view" | "edit";
  textInput?: "text-area" | "input";
  introPage?: React.ReactNode;
};
