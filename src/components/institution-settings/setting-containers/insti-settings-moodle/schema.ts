import type { MoodleIntegration as PrismaMoodle } from "@prisma/client";
import { z } from "zod";

export type TransferType = "no-transfer" | "to-fuxam" | "both-ways";
export type MoodleIntegrationDataPoint = {
  users: TransferType;
  appointments: TransferType;
  courses: TransferType;
};

export type MoodleIntegration = Omit<PrismaMoodle, "data"> & {
  data?: MoodleIntegrationDataPoint;
};

export const moodleCredentialsSchema = z.object({
  siteUrl: z.string().url(),
  apiKey: z.string().min(1),
});

export type MoodleCredentialsSchemaType = z.infer<
  typeof moodleCredentialsSchema
>;

export const MOODLE_QUERY_KEY = ["moodle-integration"];
