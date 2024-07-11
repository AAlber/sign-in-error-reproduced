import type { WorkbenchElementType } from "../element-type";
import { ElementBehaviourType, ElementType } from "../element-type";
import { ElementBody } from "./element-body";
import { ElementIcon, ElementIconSmall } from "./element-icons";
import MenuItems from "./menu-items";

export const video: WorkbenchElementType = {
  id: ElementType.VIDEO,
  name: "workbench.sidebar_element_youtube",
  icon: ElementIcon(),
  iconSmall: ElementIconSmall(),
  behaviourType: ElementBehaviourType.INFORMATIVE,
  defaultMetadata: {},
  exampleForAI: [],
  component: (elementId) => ElementBody(elementId),
  elementSpecificMenuItems: () => MenuItems(),
};
