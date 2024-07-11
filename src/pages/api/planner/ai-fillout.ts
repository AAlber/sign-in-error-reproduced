import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getAIServerHandler } from "@/src/server/functions/server-ai/handler/server-ai";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import { plannerConstraintsSchema } from "@/src/types/planner/planner.types";
import { log } from "@/src/utils/logger/logger";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const { userId } = getAuth(req);

      const { text } = JSON.parse(req.body) as {
        text: string;
      };

      log.context("AI Fillout", { text });

      const institutionId = await getCurrentInstitutionId(userId!);
      if (!institutionId) {
        log.warn("No current institution id");
        return res.status(404).json({ message: "No institution" });
      }

      if (!text) {
        log.warn("No text provided");
        return res.status(403).json({ message: "No text provided" });
      }

      const ai = await getAIServerHandler(userId!);

      const response = await ai.generate.object({
        model: "gpt-3.5-turbo",
        schema: plannerConstraintsSchema,
        system:
          'You are a planner constrains fill out bot. You can only reply in JSON format! If the user says anything unrelated to appointments and schedule constraints just return the default settings. These are the types and defaults import dayjs from "dayjs";\nimport { RRule } from "rrule";\n\n// Defaults\n\nexport const defaultOptions: Options = {\n  duration: 60,\n  maxAppointmentsPerDay: 1,\n  type: "online",\n};\n\nexport const defaultConstraints: PlannerConstraints = {\n  quantity: { type: "appointments", value: 5 },\n  dateRange: {\n    from: new Date(),\n    to: dayjs().add(1, "month").toDate(),\n  },\n  allowSwitchingTypesOnRoomUnavailability: false,\n  options: defaultOptions,\n  availableTimeSlots: [\n    {\n      rrule: new RRule({\n        freq: RRule.WEEKLY,\n        byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],\n      }),\n      startTime: { hour: 9, minute: 0 },\n      endTime: { hour: 17, minute: 0 },\n      mode: "use-default-options",\n    },\n  ],\n};\n\n// Types\n\nexport type PlannerConstraints = {\n  quantity: Quantity;\n  dateRange: {\n    from: Date;\n    to: Date;\n  };\n  allowSwitchingTypesOnRoomUnavailability: boolean;\n  options: Options;\n  availableTimeSlots: AvailableTimeSlot[];\n};\n\ntype Quantity = {\n  type: "appointments" | "hours";\n  value: number;\n};\n\ntype AvailableTimeSlotBase = {\n  rrule: RRule;\n  startTime: {\n    hour: number;\n    minute: number;\n  };\n  endTime: {\n    hour: number;\n    minute: number;\n  };\n};\n\nexport type AvailableTimeSlotWithCustomOptions = AvailableTimeSlotBase & {\n  mode: "use-custom-options";\n  options: Options;\n};\n\ntype AvailableTimeSlotWithoutCustomOptions = AvailableTimeSlotBase & {\n  mode: "use-default-options";\n};\n\nexport type AvailableTimeSlot =\n  | AvailableTimeSlotWithCustomOptions\n  | AvailableTimeSlotWithoutCustomOptions;\n\nexport type Options = {\n  duration: number;\n  type: "online" | "offline";\n  maxAppointmentsPerDay: number;\n};\n\nThe current day is: ' +
          new Date().toISOString() +
          "\nSo if the user mentions things like 'next week' you fill out the types relative to the current date. ",
        messages: [
          {
            role: "user",
            content:
              "I need 5 hours worth of appointments, from June 18 to June 30, from 8 to 12 in the morning, on every second week on each weekday",
          },
          {
            role: "assistant",
            content:
              '{\n  quantity: { type: "hours", value: 5 },\n  dateRange: {\n   from: "2024-06-18T00:00:00.000Z",\n  to: "2024-06-30T00:00:00.000Z",\n  },\n  allowSwitchingTypesOnRoomUnavailability: false,\n  options: {\n  duration: 60,\n  maxAppointmentsPerDay: 1,\n  type: "online",\n},\n  availableTimeSlots: [\n    {\n      rrule: "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;INTERVAL=2",\n      startTime: { hour: 8, minute: 0 },\n      endTime: { hour: 12, minute: 0 },\n      mode: "use-default-options",\n    },\n  ],\n}',
          },
          {
            role: "user",
            content:
              "I need 35 appointments from next week until end of year. all of them should online except the ones on friday. the appointments occur every weekday from 9 to 5",
          },
          {
            role: "assistant",
            content:
              '{\n  quantity: { type: "appointments", value: 35 },\n  dateRange: {\n   from: "2024-05-22T00:00:00.000Z",\n  to: "2024-12-31T00:00:00.000Z",\n  },\n  allowSwitchingTypesOnRoomUnavailability: false,\n  options: {\n    duration: 60,\n    maxAppointmentsPerDay: 1,\n    type: "online",\n  },\n  availableTimeSlots: [\n    {\n      rrule: "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH",\n      startTime: { hour: 9, minute: 0 },\n      endTime: { hour: 17, minute: 0 },\n      mode: "use-default-options",\n    },\n    {\n      rrule: "FREQ=WEEKLY;BYDAY=FR",\n      startTime: { hour: 9, minute: 0 },\n      endTime: { hour: 17, minute: 0 },\n      mode: "use-custom-options",\n      options: {\n        duration: 60,\n        maxAppointmentsPerDay: 1,\n        type: "offline",\n      },\n    },\n  ],\n}',
          },
          {
            role: "user",
            content:
              "i need 20 hours of appointmnets, on mondays and tuesdays, the monday onces are 60min and online long and the tuesday onces are offline and 30min long",
          },
          {
            role: "assistant",
            content:
              '{\n  quantity: { type: "hours", value: 20 },\n  dateRange: {\n   from: "2024-06-03T00:00:00.000Z",\n  to: "2024-06-17T00:00:00.000Z",\n  },\n  allowSwitchingTypesOnRoomUnavailability: false,\n  options: {\n    duration: 60,\n    maxAppointmentsPerDay: 1,\n    type: "online",\n  },\n  availableTimeSlots: [\n    {\n      rrule:"FREQ=WEEKLY;BYDAY=MO",\n      startTime: { hour: 9, minute: 0 },\n      endTime: { hour: 17, minute: 0 },\n      mode: "use-default-options",\n    },\n    {\n      rrule:"FREQ=WEEKLY;BYDAY=TU",\n      startTime: { hour: 9, minute: 0 },\n      endTime: { hour: 17, minute: 0 },\n      mode: "use-custom-options",\n      options: {\n        duration: 30,\n        maxAppointmentsPerDay: 1,\n        type: "offline",\n      },\n    },\n  ],\n}',
          },
          {
            role: "user",
            content: "I need 30 hours of appointments",
          },
          {
            role: "assistant",
            content:
              '{\n  quantity: { type: "hours", value: 30 },\n  dateRange: {\n    from: "2024-06-03T00:00:00.000Z",\n    to: "2024-07-03T00:00:00.000Z",\n  },\n  allowSwitchingTypesOnRoomUnavailability: false,\n  options: {\n    duration: 60,\n    maxAppointmentsPerDay: 1,\n    type: "online",\n  },\n  availableTimeSlots: [\n    {\n      rrule: "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR",\n      startTime: { hour: 9, minute: 0 },\n      endTime: { hour: 17, minute: 0 },\n      mode: "use-default-options",\n    },\n  ],\n}',
          },
          {
            role: "user",
            content: "i need 17 appointments, there can be 2 a day",
          },
          {
            role: "assistant",
            content:
              '{\n  quantity: { type: "appointments", value: 17 },\n  dateRange: {\n    from: "2024-06-03T00:00:00.000Z",\n    to: "2024-06-24T00:00:00.000Z",\n  },\n  allowSwitchingTypesOnRoomUnavailability: false,\n  options: {\n    duration: 60,\n    maxAppointmentsPerDay: 2,\n    type: "online",\n  },\n  availableTimeSlots: [\n    {\n      rrule: "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR",\n      startTime: { hour: 9, minute: 0 },\n      endTime: { hour: 17, minute: 0 },\n      mode: "use-default-options",\n    },\n  ],\n}',
          },
          {
            role: "user",
            content:
              text +
              ". Keep in mind that it is " +
              new Date().toISOString() +
              ". So if ) mention things like 'next week' fill out the types relative to the current date. Next week often means beginning of next week and the week starts on monday. If there are no times provided, use the defaults. 9 to 5, every weekday",
          },
        ],
      });

      if (response.status !== "success") {
        if (response.status === "budget-exceeded") {
          log.warn("AI planner fillout response budget exceeded", response);
          return res.status(402).json({ message: "Budget exceeded" });
        }
        log.warn("AI planner fillout response not successful", response);
        throw new Error("AI planner fillout response not successful");
      }

      return res.status(200).json({ constraints: response.data });
    } catch (error) {
      log.error(error);
      res.status(500).json({ message: error });
    }
  } else {
    log.warn("Method not allowed");
    res.status(405).end();
  }
}
