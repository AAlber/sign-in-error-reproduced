export enum ElementType {
  HEADING = 1,
  PARAGRAPH = 2,
  IMAGE = 3,
  MAGICTASK = 4,
  TEXT = 5,
  MULTIPLE_CHOICE = 6,
  CODE = 7,
  VOCABULARY = 8,
  SINGLE_CHOICE = 9,
  ATTACHMENT = 10,
  CLOZE = 11,
  VIDEO = 12,
  VIMEO = 13,
  QUESTIONAIRE = 14,
}

export enum ElementBehaviourType {
  INFORMATIVE,
  INTERACTIVE,
  AUTOMATION,
}

export interface WorkbenchElementType {
  id: ElementType;
  name: string;
  icon: JSX.Element;
  iconSmall: JSX.Element;
  behaviourType: ElementBehaviourType;
  defaultMetadata: any;
  exampleForUser?: string;
  exampleForAI: any[];
  depcrecated?: boolean;
  component: { (elementId: string): JSX.Element };
  elementSpecificMenuItems?: { (elementId: string): JSX.Element };
}
