import * as Sentry from "@sentry/browser";
import { z } from "zod";
import api from "../pages/api/api";

const FuxamEdgeConfigSchema = z.object({
  maintenance: z.boolean(),
  institutionsThatHaveFakeTrialPlan: z.array(z.string()),
});

const StrictFuxamEdgeConfigSchema = FuxamEdgeConfigSchema.strict();
export type FuxamEdgeConfig = z.infer<typeof StrictFuxamEdgeConfigSchema>;

export async function getVercelEdgeConfig(): Promise<FuxamEdgeConfig> {
  const result = await fetch(api.getEdgeConfig);

  if (!result.ok) {
    Sentry.captureException(new Error("Cannot get edge config"));
  }

  const resEdgeConfig = await result.json();
  try {
    return StrictFuxamEdgeConfigSchema.parse(resEdgeConfig);
  } catch (error) {
    Sentry.captureException(
      new Error(
        "Mismatching config parameters. The edge config on Vercel does not match the FuxamConfig type.",
      ),
      {
        extra: {
          edgeConfig: resEdgeConfig,
          zodError: error,
        },
      },
    );
    return FuxamEdgeConfigSchema.parse(resEdgeConfig);
  }
}
