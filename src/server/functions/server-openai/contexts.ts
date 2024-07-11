import { ElementType } from "@/src/components/workbench-deprecated/elements/element-type";
import type {
  ServerGenerateContentFromText,
  ServerGenerateElementFromFact,
  ServerGenerateElementFromTopic,
  ServerGenerateFactsFromTextChunk,
} from "@/src/types/soon_deprecated_ai";
import { getFullLanguageName } from "@/src/utils/utils";

type PromptContext = any[];

export const CONTEXT_SUBTOPICS_FROM_TEXT = (
  data: ServerGenerateContentFromText,
): PromptContext => [
  {
    role: "system",
    content:
      "You are a helpful subtopic detector bot. Your job is to respond with a list of 10 subtopics in the provided language based on the input.",
  },
  {
    role: "user",
    content:
      'Language: English, Input: Climate Change\nJSON Response: { "topics": ["Global Warming what is it?", "Greenhouse Effect and its impact on the world", "Explain Greenhouse Gases", "Carbon Dioxide and its dangers", "Methane and its role in climate change", "Climate Change - Nitrous Oxide", "Climate Change - Water Vapor", "Climate Change - Ozone", "Climate Change - Chlorofluorocarbons"]}',
  },
  {
    role: "user",
    content:
      "Language: " +
      getFullLanguageName(data.language) +
      ", Input: " +
      data.prompt +
      "\nJSON Response:",
  },
];

export const CONTEXT_GENERATE_ELEMENT_FOR_TOPIC = (
  data: ServerGenerateElementFromTopic,
): PromptContext =>
  data.elementType.id === ElementType.HEADING
    ? [
        ...data.elementType.exampleForAI,
        {
          role: "user",
          content:
            "Give me a Heading. Language: " +
            data.language +
            ", Input: " +
            data.prompt +
            "\nJSON Response:",
        },
      ]
    : [
        ...data.elementType.exampleForAI,
        {
          role: "user",
          content:
            "Give me a task. Language: " +
            data.language +
            ", Input: " +
            data.topic +
            "\nJSON Response:",
        },
      ];

const jupiterExample =
  "Jupiter is believed to be the oldest planet in the Solar System.[26] Current models of Solar System formation suggest that Jupiter formed at or beyond the snow line: a distance from the early Sun where the temperature was sufficiently cold for volatiles such as water to condense into solids.[27] The planet began as a solid core, which then accumulated its gaseous atmosphere. As a consequence, the planet must have formed before the solar nebula was fully dispersed.[28] During its formation, Jupiter's mass gradually increased until it had 20 times the mass of the Earth, approximately half of which was made up of silicates, ices and other heavy-element constituents.[26] When th";

export const CONTEXT_GENERATE_FACTS_FROM_TEXT_CHUNK = (
  data: ServerGenerateFactsFromTextChunk,
): PromptContext => [
  {
    role: "system",
    content:
      "You are a helpful fact detector bot. Your job is to respond with the a list of facts from the content. Keep the facts short and concise. Only include the most important facts.",
  },
  {
    role: "user",
    content:
      "As an advanced AI document analyzer, your task is to process a given PDF, which may contain incomplete or partial data due to data loss. Your primary objective is to extract all pertinent details, collating them into a list of clear, succinct, and pedagogically relevant facts that a student can effectively learn from. ONLY include 3 facts. Language: English, Content: " +
      jupiterExample +
      ' \nJSON Response: {"facts": ["Jupiter is believed to be the oldest planet in the Solar System.", "Current models of Solar System formation suggest that Jupiter formed at or beyond the snow line: a distance from the early Sun where the temperature was sufficiently cold for volatiles such as water to condense into solids.", "The planet began as a solid core, which then accumulated its gaseous atmosphere."]}',
  },
  {
    role: "user",
    content:
      "As an advanced AI document analyzer, your task is to process a given PDF, which may contain incomplete or partial data due to data loss. Your primary objective is to extract all pertinent details, collating them into a list of clear, succinct, and pedagogically relevant facts that a student can effectively learn from. ONLY include 3 facts. Language: " +
      getFullLanguageName(data.language) +
      ", Content: " +
      data.textChunk +
      " \nJSON Response:",
  },
];

export const CONTEXT_GENERATE_ELEMENT_FOR_FACT = (
  data: ServerGenerateElementFromFact,
  index: number,
): PromptContext =>
  data.elementType.id === ElementType.HEADING
    ? [
        ...data.elementType.exampleForAI,
        {
          role: "user",
          content:
            "You saw how the format of this task looks, I now want you to read this list of facts, read it and then decide a heading best fitting for thise list. Language: " +
            data.language +
            ", Input: " +
            data.factList +
            "\nJSON Response:",
        },
      ]
    : [
        ...data.elementType.exampleForAI,
        {
          role: "user",
          content:
            "You saw how the format of this task looks, I now want you to read this fact, and then create the task best fitting for it. Language: " +
              data.language +
              ", Input: " +
              data.factList[index] ??
            data.factList[Math.floor(Math.random() * data.factList.length)] +
              "\nJSON Response:",
        },
      ];

export const GENERATE_COURSE_ICON = (
  name: string,
  icons: any,
): PromptContext => {
  return [
    {
      role: "system",
      content: `
      You are a helpful icon selector bot. Avialable icons are: ${JSON.stringify(
        icons,
      )}.
      Your job is to select the best icon path for the name provided.
      You can only choose icons from the available icons. If the name does not match any of the icons, you can respond with a random icon or a next best match.
      You can only answer in the following format: { "icon": "path/to/icon" }
      `,
    },
    {
      role: "user",
      content: "Name: " + name + "\nJSON Response:",
    },
  ];
};
