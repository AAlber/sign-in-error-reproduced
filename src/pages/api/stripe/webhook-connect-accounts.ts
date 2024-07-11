import { buffer } from "micro";
import type { NextApiRequest, NextApiResponse } from "next";
import type Stripe from "stripe";
import { updateConnectAccount } from "@/src/server/functions/server-stripe/webhook-handlers";
import { stripe } from "@/src/server/singletons/stripe";
import { isJsonObject } from "@/src/utils/utils";
import { prisma } from "../../../server/db/client";

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

const webhookSecret = process.env.STRIPE_WEBHOOK_CONNECT_ACCOUNTS_SECRET!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig as string, webhookSecret);

      // Handle the event
      switch (event.type) {
        case "account.updated":
          await updateConnectAccount(event.data.object as Stripe.Account);

          break;
      }

      // record the event in the database
      const stripeEvent = await prisma.stripeLog.create({
        data: {
          id: event.id,
          type: event.type,
          object: event.object,
          api_version: event.api_version,
          account: event.account,
          created: new Date(event.created * 1000), // convert to milliseconds
          data: {
            object: isJsonObject(event.data.object) ? event.data.object : null,
            previous_attributes: isJsonObject(event.data.previous_attributes)
              ? event.data.previous_attributes
              : null,
          },
          livemode: event.livemode,
          pending_webhooks: event.pending_webhooks,
          request: {
            id: event.request?.id,
            idempotency_key: event.request?.idempotency_key,
          },
        },
      });

      res.json({ received: true });
    } catch (err) {
      res.status(400).send(`Webhook Error: ${(err as any).message}`);
      return;
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
