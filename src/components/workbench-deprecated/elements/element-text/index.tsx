import type { WorkbenchElementType } from "../element-type";
import { ElementBehaviourType, ElementType } from "../element-type";
import { getExample } from "./ai-examples";
import { ElementBody } from "./element-body";
import { ElementIcon, ElementIconSmall } from "./element-icons";

export const text: WorkbenchElementType = {
  id: ElementType.TEXT,
  name: "workbench.sidebar_element_text",
  icon: ElementIcon(),
  iconSmall: ElementIconSmall(),
  behaviourType: ElementBehaviourType.INTERACTIVE,
  defaultMetadata: {},
  exampleForAI: getExample(),
  component: (elementId) => ElementBody(elementId),
};
