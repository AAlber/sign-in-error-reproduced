import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest } from "next";
import { sentry } from "@/src/server/singletons/sentry";
import cacheHandler from "@/src/utils/cache-handler/cache-redis-handler";
import { sleep } from "@/src/utils/utils";

/**
 * Streams the QR token via Server Sent Events (SSE) over the edge.
 * token is cached in vercel KV for a set expiry
 */

export default async function handler(req: Request) {
  const { userId } = getAuth(req as unknown as NextApiRequest);
  const expiryMs = 15000;

  const url = new URL(req.url);
  const appointmentId = url.searchParams.get("appointmentId");

  sentry.addBreadcrumb({ message: "Initialize rotating qr SSE" });
  if (!userId) return new Response(null, { status: 401 });

  sentry.setUser({ id: userId });
  if (!appointmentId) return new Response(null, { status: 400 });

  let closed = false;
  let ctrl: ReadableStreamDefaultController;

  const close = () => {
    closed = true;
    ctrl.close();
  };

  req.signal.addEventListener("abort", close);

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      ctrl = controller;

      while (!closed) {
        const uuid = crypto.randomUUID();
        const msg = "data: " + JSON.stringify({ token: uuid }) + "\n\n";

        cacheHandler
          .set(
            "appointment-checkin-rotating-token",
            uuid,
            appointmentId,
            expiryMs / 1000, // in seconds
          )
          .then((result) => {
            if (result !== "OK") close();
          });

        controller.enqueue(encoder.encode(msg));
        await sleep(expiryMs);
      }

      close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform",
      "Content-Encoding": "none",
    },
  });
}

export const config = {
  runtime: "edge",
};
