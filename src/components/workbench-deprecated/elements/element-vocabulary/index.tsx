import type { WorkbenchElementType } from "../element-type";
import { ElementBehaviourType, ElementType } from "../element-type";
import { getExample } from "./ai-example";
import { ElementBody } from "./element-body";
import { ElementIcon, ElementIconSmall } from "./element-icons";

export const vocabulary: WorkbenchElementType = {
  id: ElementType.VOCABULARY,
  name: "workbench.sidebar_element_vocabulary",
  icon: ElementIcon(),
  iconSmall: ElementIconSmall(),
  behaviourType: ElementBehaviourType.INTERACTIVE,
  defaultMetadata: {
    task: "",
    words: [
      { text: "Word 1", word: "" },
      { text: "Word 2", word: "" },
    ],
  },
  exampleForUser: "Chinese food related words",
  exampleForAI: getExample(),
  component: (elementId) => ElementBody(elementId),
};
