import type { WorkbenchElementType } from "../element-type";
import { ElementBehaviourType, ElementType } from "../element-type";
import { getExample } from "./ai-example";
import { ElementBody } from "./element-body";
import { ElementIcon, ElementIconSmall } from "./element-icons";
import MenuItems from "./menu-items";

export const singleChoice: WorkbenchElementType = {
  id: ElementType.SINGLE_CHOICE,
  name: "workbench.sidebar_element_single_choice",
  icon: ElementIcon(),
  iconSmall: ElementIconSmall(),
  depcrecated: true,
  behaviourType: ElementBehaviourType.INTERACTIVE,
  defaultMetadata: {
    choices: [
      { text: "", checked: false },
      { text: "", checked: false },
    ],
  },
  exampleForUser: "The planet with the most moons",
  exampleForAI: getExample(),
  component: (elementId) => ElementBody(elementId),
  elementSpecificMenuItems: (elementId) => MenuItems(elementId),
};
