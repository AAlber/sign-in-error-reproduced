import cuid from "cuid";
import type OpenAI from "openai";
import type {
  ServerGenerateContentFromPDFText,
  ServerGenerateContentFromText,
  ServerGenerateContentResponse,
  ServerGenerateElementFromFact,
  ServerGenerateElementFromTopic,
  ServerGenerateElementsFromFactList,
  ServerGenerateElementsFromTopicList,
  ServerGenerateFactsFromTextChunk,
  ServerGenerateFactsFromTextChunks,
} from "@/src/types/soon_deprecated_ai";
import { chunkAndCleanText, retry } from "@/src/utils/utils";
import {
  CONTEXT_GENERATE_ELEMENT_FOR_FACT,
  CONTEXT_GENERATE_ELEMENT_FOR_TOPIC,
  CONTEXT_GENERATE_FACTS_FROM_TEXT_CHUNK,
  CONTEXT_SUBTOPICS_FROM_TEXT,
} from "./contexts";

export async function generateContentFromText(
  data: ServerGenerateContentFromText,
): Promise<ServerGenerateContentResponse> {
  const subtopics = await getSubtopicsFromText(data);
  const content = await generateElementsForTopicList({
    ...data,
    topicList: subtopics,
  });

  return content;
}

export async function generateContentFromPdfText(
  data: ServerGenerateContentFromPDFText,
): Promise<ServerGenerateContentResponse> {
  const textChunks = chunkAndCleanText(data.pdfText);
  const facts = await getFactsFromChunks({ ...data, textChunks });
  const content = await generateElementsForFactList({
    ...data,
    factList: facts,
  });
  return content;
}

export async function getSubtopicsFromText(
  data: ServerGenerateContentFromText,
): Promise<string[]> {
  const aiResponse = await data.openAiInstance.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    messages: CONTEXT_SUBTOPICS_FROM_TEXT(data),
  });
  try {
    const topics = JSON.parse(
      aiResponse.choices[0]?.message?.content as string,
    );
    return topics.topics;
  } catch (error) {
    console.error("Failed to parse the subtopics of string:", error);
    return [];
  }
}

export async function getFactsFromChunks(
  data: ServerGenerateFactsFromTextChunks,
): Promise<string[]> {
  let chunks = data.textChunks;
  chunks = chunks.sort(() => Math.random() - Math.random()).slice(0, 10);
  const facts = await Promise.allSettled(
    chunks
      .slice()
      .map(async (chunk) => getFactsFromChunk({ ...data, textChunk: chunk })),
  );

  const allFactsFromChunks = facts.flatMap((fact) =>
    fact.status === "fulfilled" ? fact.value : [],
  );
  return allFactsFromChunks;
}

export async function getFactsFromChunk(
  data: ServerGenerateFactsFromTextChunk,
): Promise<string[]> {
  const aiResponse = await data.openAiInstance.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    messages: CONTEXT_GENERATE_FACTS_FROM_TEXT_CHUNK(data),
  });
  try {
    const facts = JSON.parse(
      aiResponse.choices[0]?.message?.content as string,
    ) as { facts: string[] };
    return facts.facts;
  } catch (error) {
    console.error("Failed to parse the statements of string:", aiResponse);
    return [];
  }
}

export async function generateElementsForTopicList(
  data: ServerGenerateElementsFromTopicList,
) {
  const promises = data.requestedElements.map((type, index) =>
    retry(
      () =>
        generateElementForTopic({
          ...data,
          topic: data.topicList[index]!,
          elementType: type,
        }),
      {
        retryIntervalMs: 10,
      },
    ),
  );
  const results = await Promise.all(promises);
  return results;
}

export async function generateElementForTopic(
  data: ServerGenerateElementFromTopic,
) {
  const aiResponse = await (
    data.openAiInstance as OpenAI
  ).chat.completions.create({
    model: "gpt-4-0125-preview",
    messages: CONTEXT_GENERATE_ELEMENT_FOR_TOPIC(data),
    response_format: { type: "json_object" },
  });

  const metadata = JSON.parse(
    aiResponse.choices[0]?.message?.content as string,
  );
  return {
    id: cuid(),
    type: data.elementType.id,
    metadata: metadata,
  };
}

export async function generateElementsForFactList(
  data: ServerGenerateElementsFromFactList,
) {
  const promises = data.requestedElements.map((type, index) =>
    retry(
      () =>
        generateElementForFact(
          {
            ...data,
            elementType: type,
          },
          index,
        ),
      {
        retryIntervalMs: 10,
      },
    ),
  );
  const results = await Promise.all(promises);
  return results;
}

export async function generateElementForFact(
  data: ServerGenerateElementFromFact,
  index: number,
) {
  const aiResponse = await data.openAiInstance.chat.completions.create({
    model: "gpt-4-0125-preview",
    messages: CONTEXT_GENERATE_ELEMENT_FOR_FACT(data, index),
    response_format: { type: "json_object" },
  });

  const metadata = JSON.parse(
    aiResponse.choices[0]?.message?.content as string,
  );
  return {
    id: cuid(),
    type: data.elementType.id as any,
    metadata: metadata,
  };
}
