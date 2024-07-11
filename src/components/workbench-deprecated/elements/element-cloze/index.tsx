import type { WorkbenchElementType } from "../element-type";
import { ElementBehaviourType, ElementType } from "../element-type";
import { getExample } from "./ai-examples";
import { ElementBody } from "./element-body";
import { ElementIcon, ElementIconSmall } from "./element-icons";

export const cloze: WorkbenchElementType = {
  id: ElementType.CLOZE,
  name: "workbench.sidebar_element_fill_the_blanks",
  icon: ElementIcon(),
  iconSmall: ElementIconSmall(),
  behaviourType: ElementBehaviourType.INTERACTIVE,
  defaultMetadata: {
    task: "Fill in the blanks",
  },
  exampleForAI: getExample(),
  component: (elementId) => ElementBody(elementId),
};
