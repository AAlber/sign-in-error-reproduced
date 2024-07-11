export interface WorkbenchContent {
  title: string;
  pages: WorkbenchPage[];
}

export interface WorkbenchPage {
  id: string;
  elements: WorkbenchElement[];
  thumbnail: string;
  new?: boolean;
}

export interface WorkbenchElement {
  id: string;
  type: number;
  metadata: ElementMetadata;
}

export type Metadata = {
  achieved_points: number;
  answer: string;
  task: string;
  choices: {
    checked: boolean;
    text: string;
    points?: number;
  }[];
  code: string;
  evaluated: boolean;
  heading: string;
  logics: SurveyLogic[];
  points: number;
  questions: SurveyQuestion[];
  text: string;
  review_comment: {
    user: Workbench["selectedUser"];
    text: string;
  };
  words: { word: string; answer: string }[];
};

export type ElementMetadata = Partial<Metadata> & Record<string, any>;

interface Workbench {
  open: boolean;
  content: WorkbenchContent;
  mode: WorkbenchMode;
  submittedUsers: any[];
  documents: TaskUserDocument[];
  selectedUser: { id: string; image?: string; name: string } | undefined;
  selectedElement: any;
  blockId: string;
  refresh: number;
  workbenchType: WorkbenchType;
  currentPage: string;
  noNameError: boolean;
  getElementById: (elementId: string) => WorkbenchElement | undefined;
  getIndexOfElement: (elementId: string) => number;
  getElementsOfCurrentPage: () => WorkbenchElement[];
  getCurrentPage: () => WorkbenchPage;
  setTitle: (data: string) => void;
  getElementsOfPage: (pageId: string) => WorkbenchElement[];
  updatePageThumbnail: (pageId: string, thumbnail: string) => void;
  setCurrentPage: (data: string) => void;
  setOpen: (data: boolean) => void;
  setMode: (data: WorkbenchMode) => void;
  setContent: (data: WorkbenchContent) => void;
  setSelectedUser: (data: Workbench["selectedUser"]) => void;
  setSelectedElement: (data: any) => void;
  setPages: (data: WorkbenchPage[]) => void;
  getPages: () => WorkbenchPage[];
  addPage: () => void;
  addContentToPage: (pageId: string, content: WorkbenchElement[]) => void;
  addContentToNewPage: (content: WorkbenchElement[]) => void;
  insertNewPage: (index: number) => void;
  insertPage: (page: WorkbenchPage, index: number) => void;
  removePage: (pageId: string) => void;
  setElements: (data: WorkbenchElement[]) => void;
  appendElement: (data: WorkbenchElement) => void;
  getIndexOfPage: (pageId: string) => number;
  addElement: (data: WorkbenchElement) => void;
  addElementAt: (data: WorkbenchElement, index: number) => void;
  removeElement: (elementId: string) => void;
  updateElement: (elementId: string, data: WorkbenchElement) => void;
  updateElementMetadata: (elementId: string, metadata: ElementMetadata) => void;
  getElementMetadata: (elementId: string) => ElementMetadata;
  addSubmittedUser: (user: any) => void;
  addDocument: (document: TaskUserDocument) => void;
  updateDocument: (userId: string, content: string) => void;
  removeDocument: (documentId: string) => void;
  openEmptyWorkbench: (workbenchType: WorkbenchType) => void;
  openPregeneratedWorkbench: (workbenchType: WorkbenchType) => void;
  openWorkbenchWithContent: ({
    content,
    workbenchType = WorkbenchType.ASSESSMENT,
    readOnly = false,
  }: {
    content: WorkbenchContent;
    workbenchType?: WorkbenchType;
    readOnly?: boolean;
  }) => void;
  openWorkbenchFromBlock: ({
    content,
    mode,
    blockId,
    workbenchType,
  }: {
    content: WorkbenchContent;
    mode: WorkbenchMode.FILLOUT | WorkbenchMode.READONLY | WorkbenchMode.REVIEW;
    workbenchType: WorkbenchType;
    blockId: string;
  }) => void;
  openWorkbenchFromUserData: ({
    content,
    blockId,
    workbenchType,
    user,
  }: {
    content: WorkbenchContent;
    workbenchType: WorkbenchType;
    blockId: string;
    user: Workbench["selectedUser"];
  }) => void;
  reset: () => void;
  refreshWorkbench: () => void;
}
