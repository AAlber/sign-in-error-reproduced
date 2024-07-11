// @ts-check
import { z } from "zod";

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
  ANALYZE: z.string(),
  CLERK_SECRET_KEY: z.string(),
  CLERK_WEBHOOK_USER_UPDATE: z.string(),
  DATABASE_URL: z.string(),
  GIPHY_API_KEY: z.string(),
  GOOGLE_MAPS_API_KEY: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  OPENAI_API_KEY: z.string(),
  FUXAM_SECRET: z.string(),
  UNSPLASH_ACCESS_KEY: z.string(),
  NODE_ENV: z.enum(["development", "test", "production"]),
  SG_API_KEY: z.string(),
  STREAM_API_KEY: z.string(),
  STREAM_APP_ID: z.string(),
  STREAM_API_SECRET: z.string(),
  STRIPE_PRICE_ID: z.string(),
  STRIPE_SK: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),
  STRIPE_CHATGPT_PRICE_ID: z.string(),
  SERVER_URL: z.string(),
  REDIS_URL: z.string(),
});

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const clientSchema = z.object({
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
  NEXT_PUBLIC_STREAM_APP_ID: z.string(),
  NEXT_PUBLIC_STREAM_API_KEY: z.string(),
  NEXT_PUBLIC_STRIPE_PK: z.string(),
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string(),
});

/**
 * You can't destruct `process.env` as a regular object, so you have to do
 * it manually here. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [k in keyof z.infer<typeof clientSchema>]: z.infer<typeof clientSchema>[k] | undefined }}
 */
export const clientEnv = {
  NEXT_PUBLIC_STREAM_APP_ID: process.env.NEXT_PUBLIC_STREAM_APP_ID,
  NEXT_PUBLIC_STREAM_API_KEY: process.env.NEXT_PUBLIC_STREAM_API_KEY,
  NEXT_PUBLIC_STRIPE_PK: process.env.NEXT_PUBLIC_STRIPE_PK,
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
};
