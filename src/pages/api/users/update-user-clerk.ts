import type { WebhookEvent } from "@clerk/clerk-sdk-node";
import type { IncomingHttpHeaders } from "http";
import { buffer } from "micro";
import type { NextApiRequest, NextApiResponse } from "next";
import type { WebhookRequiredHeaders } from "svix";
import { Webhook } from "svix";
import { env } from "@/src/env/server.mjs";
import { prisma } from "@/src/server/db/client";

// Disable the bodyParser so we can access the raw
// request body for verification.
export const config = {
  api: {
    bodyParser: false,
  },
};

const webhookSecret = env.CLERK_WEBHOOK_USER_UPDATE;

export default async function handler(
  req: NextApiRequestWithSvixRequiredHeaders,
  res: NextApiResponse,
) {
  // Verify the webhook signature
  // See https://docs.svix.com/receiving/verifying-payloads/how
  const payload = (await buffer(req)).toString();
  const headers = req.headers;
  const wh = new Webhook(webhookSecret);
  let evt: WebhookEvent | null = null;
  try {
    evt = wh.verify(payload, headers) as WebhookEvent;
  } catch (_) {
    return res.status(400).json({});
  }

  // Handle the webhook
  if (evt.type === "user.updated") {
    const data = evt.data;
    const user = await prisma.user.findUnique({
      where: { id: data.id },
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    const primaryEmail = data.email_addresses.find(
      (i) => i.id === data.primary_email_address_id,
    )?.email_address;
    const update = await prisma.user.update({
      where: { id: data.id },
      data: {
        name: data.first_name + " " + data.last_name,
        image: data.image_url,
        email: primaryEmail || user?.email,
      },
    });
    return res.json(`User ${update.id} updated based on clerk data in webhook`);
  }

  res.json({});
}

type NextApiRequestWithSvixRequiredHeaders = NextApiRequest & {
  headers: IncomingHttpHeaders & WebhookRequiredHeaders;
};
