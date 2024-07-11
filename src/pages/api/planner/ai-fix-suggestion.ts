import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest } from "next";
import { getAIEdgeHandler } from "@/src/server/functions/server-ai/handler/edge-ai";
import { plannerFixOptions } from "@/src/types/planner/planner.types";

export const runtime = "edge";

export default async function handler(req: Request) {
  console.log("req", req);
  try {
    const { userId } = getAuth(req as unknown as NextApiRequest);

    const url = new URL(req.url);
    const prompt = url.searchParams.get("prompt");

    if (!prompt) return new Response(null, { status: 400 });
    console.log("prompt", prompt);

    const aiHandler = getAIEdgeHandler(userId!);
    return aiHandler.stream.object({
      model: "gpt-4o",
      system: `
      You are a planner conflict manager. 
      You'll look at a user who has some conflicts planning appointments. 
      Carefully look at the constraints and the layers and their resources and try to figure out the problem.
      Keep in mind that unavailabilities of layers or resources might contribute to the problem.
      Try pinpointing the one biggest problem that is causing the conflict, only mention the most important one.
      You'll look these and explain the problem and suggest up to three options to fix it.
      But keep in mind to only answer in natual language not in typescript. 
      The user has no access to the object itself, so he wont understand.

      Options to fix the problem (select up to three options, but prefer the least amount of options possible):
      - Allow $WEEKDAYS_ONE_OR_MULTIPLE_ALLOWED for planning - Mo, Tu, We, Th, Fr, Sa, Su, Weekdays, Weekends
      - Allow $NUMBER per day - 1, 2, 3, 4, 5, 6, 7
      - Set duration to $NUMBER minutes - Any number in 5 minute steps until 300
      - Make appointments online
      - Make $WEEKDAYS_ONE_OR_MULTIPLE_ALLOWED online - Mo, Tu, We, Th, Fr, Sa, Su
      - Allow online appointments on $WEEKDAYS_ONE_OR_MULTIPLE_ALLOWED - Mo, Tu, We, Th, Fr, Sa, Su
      - Increase date range by $NUMBER days - Any number
      - Decrease date range by $NUMBER days - Any number

      Variables with $ are placeholders that you can replace with the actual value, possible values are behind the option example.
      Hint: any rrule related data is supposed to be in the format of "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;INTERVAL=2"
      Also only change on of the constraints per option, not multiple.
       `,
      schema: plannerFixOptions,
      prompt: prompt,
    });
  } catch (error) {
    return new Response("Internal server error", { status: 500 });
  }
}
