import type { WorkbenchElementType } from "../element-type";
import { ElementBehaviourType, ElementType } from "../element-type";
import { ElementBody } from "./element-body";
import { ElementIcon, ElementIconSmall } from "./element-icons";

export const file: WorkbenchElementType = {
  id: ElementType.ATTACHMENT,
  name: "workbench.sidebar_element_file",
  icon: ElementIcon(),
  iconSmall: ElementIconSmall(),
  behaviourType: ElementBehaviourType.INFORMATIVE,
  defaultMetadata: {},
  exampleForAI: [],
  component: (elementId) => ElementBody(elementId),
};
