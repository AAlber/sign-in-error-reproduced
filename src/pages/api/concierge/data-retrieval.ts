import * as Sentry from "@sentry/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";
import type {
  ChatCompletionMessageParam,
  ChatCompletionMessageToolCall,
} from "openai/resources/index.mjs";
import type { ConciergeContext } from "./functions";
import {
  getAppointmentsOfUserInTimeSpan,
  getNextAppointments,
  getTasksOfUser,
} from "./functions";
import { concierceTools } from "./tools";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatCompletionMessageParam[] | { message: any }>,
) {
  if (req.method === "POST") {
    try {
      const { userId, context, toolCalls } = JSON.parse(req.body) as {
        userId: string;
        context: ConciergeContext;
        toolCalls: ChatCompletionMessageToolCall[] | undefined;
      };

      if (!req.headers.authorization) {
        return res.status(401).send({ message: "No authorization token" });
      }

      if (req.headers.authorization !== "Bearer " + process.env.FUXAM_SECRET) {
        return res.status(401).send({ message: "Invalid authorization token" });
      }

      if (!userId)
        return res.status(403).json({ message: "No user id provided" });

      const data: ChatCompletionMessageParam[] = [];
      if (toolCalls) {
        for (const toolCall of toolCalls) {
          if (toolCall.function.name === "get_next_appointments") {
            const appointments = await getNextAppointments(userId, context);
            data.push({
              tool_call_id: toolCall.id,
              role: "tool",
              content: JSON.stringify(appointments),
            });
          }
          if (toolCall.function.name === "get_appointments_for_specific_time") {
            const args = JSON.parse(toolCall.function.arguments);
            const startDate = new Date(args.startDate);
            const endDate = new Date(args.endDate);
            const appointments = await getAppointmentsOfUserInTimeSpan(
              userId,
              context,
              startDate,
              endDate,
            );
            data.push({
              tool_call_id: toolCall.id,
              role: "tool",
              content: JSON.stringify(appointments),
            });
          }
          if (toolCall.function.name === "get_tasks_or_homework_or_materials") {
            const args = JSON.parse(toolCall.function.arguments);
            const tasks = await getTasksOfUser(
              userId,
              args.status,
              args.dueDate,
            );
            data.push({
              tool_call_id: toolCall.id,
              role: "tool",
              content: JSON.stringify(tasks),
            });
          }
          if (toolCall.function.name === "get_capability") {
            data.push({
              tool_call_id: toolCall.id,
              role: "tool",
              content: JSON.stringify({
                capabilities: concierceTools.map((t) => t.capabilities),
              }),
            });
          }
        }
      }

      return res.status(200).json(data);
    } catch (error) {
      Sentry.captureException(error);
      res.status(500).json({ message: error });
    }
  } else {
    res.status(405).end();
  }
}
