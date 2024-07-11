import type { WorkbenchElementType } from "../element-type";
import { ElementBehaviourType, ElementType } from "../element-type";
import { getExample } from "./ai-example";
import { ElementBody } from "./element-body";
import { ElementIcon, ElementIconSmall } from "./element-icons";

export const paragraph: WorkbenchElementType = {
  id: ElementType.PARAGRAPH,
  name: "workbench.sidebar_element_paragraph",
  icon: ElementIcon(),
  iconSmall: ElementIconSmall(),
  behaviourType: ElementBehaviourType.INFORMATIVE,
  defaultMetadata: {},
  exampleForAI: getExample(),
  component: (elementId) => ElementBody(elementId),
};
