import type { WorkbenchElementType } from "../element-type";
import { ElementBehaviourType, ElementType } from "../element-type";
import { ElementBody } from "./element-body";
import { ElementIcon, ElementIconSmall } from "./element-icons";
import MenuItems from "./menu-items";

export const image: WorkbenchElementType = {
  id: ElementType.IMAGE,
  name: "workbench.sidebar_element_image",
  icon: ElementIcon(),
  iconSmall: ElementIconSmall(),
  behaviourType: ElementBehaviourType.INFORMATIVE,
  defaultMetadata: {},
  exampleForAI: [],
  component: (elementId) => ElementBody(elementId),
  elementSpecificMenuItems: (elementId) => MenuItems(elementId),
};
