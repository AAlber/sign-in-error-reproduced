import type { WorkbenchElementType } from "../element-type";
import { ElementBehaviourType, ElementType } from "../element-type";
import { getExample } from "./ai-examples";
import { ElementBody } from "./element-body";
import { ElementIcon, ElementIconSmall } from "./element-icons";

export const code: WorkbenchElementType = {
  id: ElementType.CODE,
  name: "workbench.sidebar_element_code",
  icon: ElementIcon(),
  iconSmall: ElementIconSmall(),
  behaviourType: ElementBehaviourType.INTERACTIVE,
  defaultMetadata: {},
  exampleForUser: "Generate a mistake in a JavaScript loop",
  exampleForAI: getExample(),
  component: (elementId) => ElementBody(elementId),
};
