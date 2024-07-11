import type OpenAI from "openai";
import type { WorkbenchElementType } from "@/src/components/workbench-deprecated/elements/element-type";
import type { WorkbenchElement } from "../components/workbench-deprecated/types";

interface ClientGenerateContentFoundation {
  requestedElements: WorkbenchElementType[];
  language: Language;
}

interface ClientGenerateContentFromText
  extends ClientGenerateContentFoundation {
  prompt: string;
  type: "text";
}

interface ClientGenerateContentFromPDF extends ClientGenerateContentFoundation {
  file: File;
  type: "pdf";
}

interface ClientGenerateContentFromPDFText
  extends ClientGenerateContentFoundation {
  pdfText: string;
}

type ClientGenerateContent =
  | ClientGenerateContentFromText
  | ClientGenerateContentFromPDF;

type ServerGenerateContentFromText = ClientGenerateContentFoundation &
  Pick<ClientGenerateContentFromText, "prompt"> & {
    openAiInstance: OpenAI;
  };

type ServerGenerateElementsFromTopicList = ServerGenerateContentFromText & {
  topicList: string[];
  openAiInstance: OpenAI;
};

type ServerGenerateElementFromTopic =
  ServerGenerateElementsFromTopicListData & {
    topic: string;
    openAiInstance: OpenAI;
    elementType: WorkbenchElementType;
  };

type ServerGenerateContentFromPDFText = ClientGenerateContentFoundation &
  Pick<ClientGenerateContentFromPDFText, "pdfText"> & {
    openAiInstance: OpenAI;
  };

type ServerGenerateFactsFromTextChunks = ClientGenerateContentFoundation & {
  openAiInstance: OpenAI;
  textChunks: string[];
};

type ServerGenerateFactsFromTextChunk = ClientGenerateContentFoundation & {
  openAiInstance: OpenAI;
  textChunk: string;
};

type ServerGenerateElementsFromFactList = ServerGenerateContentFromPDFText & {
  factList: string[];
  openAiInstance: OpenAI;
};

type ServerGenerateElementFromFact = ServerGenerateElementsFromFactList & {
  elementType: WorkbenchElementType;
};

type ServerGenerateContentResponse = WorkbenchElement[];
