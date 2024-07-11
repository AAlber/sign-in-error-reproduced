import type { ChatCompletionTool } from "openai/resources/index.mjs";

export const concierceTools: Array<
  ChatCompletionTool & { capabilities: string[] }
> = [
  {
    type: "function",
    capabilities: [
      "Get upcoming appointments / lectures",
      "Get information about the next appointments / lectures",
    ],
    function: {
      name: "get_next_appointments",
      description:
        "Get information about the next appointments (no matter how far in the future) / lectures and their rooms / locations as well as their duration.",
    },
  },
  {
    type: "function",
    capabilities: [
      "Get information about appointments / lectures and their rooms / locations as well as their duration",
      "Get information rooms and where the appointments / lectures are held",
      "Get information about the duration of the appointments / lectures",
    ],
    function: {
      name: "get_appointments_for_specific_time",
      description:
        "Get information about appointments / lectures and their rooms / locations as well as their duration and more information for a given time span. Maximum total timespan is 31 days.",
      parameters: {
        type: "object",
        properties: {
          startDate: {
            type: "string",
            description: "The start date of the time span (ISO 8601 format)",
          },
          endDate: {
            type: "string",
            description: "The end date of the time span (ISO 8601 format)",
          },
        },
        required: ["startDate", "endDate"],
      },
    },
  },
  {
    type: "function",
    capabilities: [
      "Get information about tasks, homeworks or materials and their status",
      "Get information about the due date of the task",
      "Get information about the status of the task",
    ],
    function: {
      name: "get_tasks_or_homework_or_materials",
      description:
        "Gets all tasks, homeworks or materials of a user and their status, as well as more information about any assignments.",
      parameters: {
        type: "object",
        properties: {
          status: {
            type: "string",
            enum: ["NOT_STARTED", "FINISHED"],
          },
          dueDate: {
            type: "string",
            description: "The due date of the task (ISO 8601 format)",
          },
        },
      },
    },
  },
  // !! this has to be the last tool, since it will be sliced off when the user asks for help
  {
    type: "function",
    capabilities: [],
    function: {
      name: "get_capability",
      description:
        "Get all the functionality of the concierge and their status. This is the tool to provide help and inform him about the capabilities of the concierge.",
    },
  },
];
