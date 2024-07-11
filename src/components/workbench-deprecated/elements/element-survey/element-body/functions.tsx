import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import {
  deepCopy,
  downloadFileFromUrl,
} from "@/src/client-functions/client-utils";
import { toast } from "@/src/components/reusable/toaster/toast";
import type { WorkbenchContent } from "../../../types";
import useWorkbench from "../../../zustand";
import type { SurveyLogic, SurveyQuestion } from "..";

export function updateQuestion(
  elementId: string,
  questionId: string,
  data: Partial<SurveyQuestion>,
) {
  const { getElementMetadata, updateElementMetadata } = useWorkbench.getState();

  const metadata = getElementMetadata(elementId);
  const originalQuestions: SurveyQuestion[] = metadata.questions || [];

  // Create a deep copy of the questions array
  const questions = deepCopy(originalQuestions);

  const questionIndex = questions.findIndex((q) => q.id === questionId);

  if (questionIndex === -1) return;

  const updatedQuestion = {
    ...questions[questionIndex],
    ...data,
  };

  questions[questionIndex] = updatedQuestion as SurveyQuestion;
  updateElementMetadata(elementId, { questions });
}

export function updateLogics(
  elementId: string,
  logicId: string,
  data: Partial<SurveyLogic>,
) {
  const { getElementMetadata, updateElementMetadata } = useWorkbench.getState();

  const metadata = getElementMetadata(elementId);
  const originalLogics: SurveyLogic[] = metadata.logics || [];

  // Create a deep copy of the questions array
  const logics = deepCopy(originalLogics);

  const logicIndex = logics.findIndex((l) => l.id === logicId);

  if (logicIndex === -1) return;

  const updatedLogic = {
    ...logics[logicIndex],
    ...data,
  };

  logics[logicIndex] = updatedLogic as SurveyLogic;
  updateElementMetadata(elementId, { logics });
}

export function getSumOfPoints(elementId: string) {
  const { getElementMetadata } = useWorkbench.getState();
  const metadata = getElementMetadata(elementId);
  const questions: SurveyQuestion[] = metadata.questions || [];

  const sum = questions.reduce((total, currentQuestion) => {
    const highestPointsInQuestion = Math.max(
      ...currentQuestion.choices.map((choice) => choice.points),
    );
    return total + highestPointsInQuestion;
  }, 0);

  return sum;
}

export function hasAnswersAllQuestions(elementId: string) {
  const { getElementMetadata } = useWorkbench.getState();
  const metadata = getElementMetadata(elementId);
  const questions: SurveyQuestion[] = metadata.questions || [];
  const hasAnsweredAllQuestions = questions.every((q) =>
    q.choices.some((c) => c.checked === true),
  );
  return hasAnsweredAllQuestions;
}

export async function evaluateSurvey(elementId: string) {
  const { getElementMetadata, updateElementMetadata } = useWorkbench.getState();

  const metadata = getElementMetadata(elementId);
  const logics: SurveyLogic[] = metadata.logics || [];
  for (const logic of logics) {
    if (resultsSatisfyLogicCondition(elementId, logic))
      await executeLogicAction(logic);
  }
  updateElementMetadata(elementId, { evaluated: true });
  await saveEvaluation();
}

export async function saveEvaluation() {
  // Workbench update: this is fucked
  const { content, blockId } = useWorkbench.getState();
  const stringifiedContent = JSON.stringify(content, null, 2);
  contentBlockHandler.userStatus.update<"StaticWorkbenchFile" | "Assessment">({
    blockId,
    data: {
      status: "IN_PROGRESS",
      userData: {
        content: stringifiedContent,
        lastViewedAt: new Date(),
        lastEditedAt: new Date(),
      },
    },
  });
}

export async function executeLogicAction(logic: SurveyLogic) {
  switch (logic.actionType) {
    case "unlock content":
      await unlockContentAndAppendToWorkbench(logic.actionLink);
      break;
    default:
      downloadFileFromUrl("", logic.actionLink);
      break;
  }
}

export async function unlockContentAndAppendToWorkbench(url: string) {
  const blob = await fetch(url).then((r) => r.blob());
  const text = await blob.text();
  const content = JSON.parse(text) as WorkbenchContent;
  const { getPages, setPages } = useWorkbench.getState();
  const pages = getPages();
  setPages([...pages, ...content.pages]);
  toast.success("toast.workbench_unlock_content_success", {
    icon: "🔓",
    description: "toast.workbench_unlock_content_success_description",
  });
}

function getTotalPoints(elementId: string) {
  const { getElementMetadata } = useWorkbench.getState();
  const metadata = getElementMetadata(elementId);
  const questions: SurveyQuestion[] = metadata.questions || [];
  const choices = questions
    .map((q) => q.choices)
    .flat()
    .filter((c) => c.checked === true);
  const sum = choices.reduce((acc, curr) => acc + curr.points, 0);
  return parseInt(sum.toString(), 10);
}

export function resultsSatisfyLogicCondition(
  elementId: string,
  logic: SurveyLogic,
): boolean {
  const totalPoints = getTotalPoints(elementId);
  switch (logic.condition) {
    case "equal to":
      return totalPoints === logic.threshold;
    case "greater than":
      return totalPoints > logic.threshold;
    case "less than":
      return totalPoints < logic.threshold;
    case "within range":
      return totalPoints > logic.threshold && totalPoints < logic.threshold2!;
    default:
      return false;
  }
}
