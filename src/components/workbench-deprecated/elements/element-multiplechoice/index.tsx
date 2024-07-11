import type { WorkbenchElementType } from "../element-type";
import { ElementBehaviourType, ElementType } from "../element-type";
import { getExample } from "./ai-example";
import { ElementBody } from "./element-body";
import { ElementIcon, ElementIconSmall } from "./element-icons";
import MenuItems from "./menu-items";

export const multipleChoice: WorkbenchElementType = {
  id: ElementType.MULTIPLE_CHOICE,
  name: "workbench.sidebar_element_multiple_choice",
  icon: ElementIcon(),
  iconSmall: ElementIconSmall(),
  behaviourType: ElementBehaviourType.INTERACTIVE,
  defaultMetadata: {
    choices: [
      { text: "", checked: false },
      { text: "", checked: false },
    ],
  },
  exampleForUser: "True and false facts about Queen Elizabeth II",
  exampleForAI: getExample(),
  component: (elementId) => ElementBody(elementId),
  elementSpecificMenuItems: (elementId) => MenuItems(elementId),
};
