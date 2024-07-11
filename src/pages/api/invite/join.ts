import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getUser } from "@/src/server/functions/server-user";
import { sentry } from "@/src/server/singletons/sentry";
import type { InviteError, InviteResponse } from "@/src/types/invite.types";
import cacheRedisHandler from "@/src/utils/cache-handler/cache-redis-handler";
import {
  getInviteAndToken,
  handleAccessPassPayment,
  handleAfterInviteCompleted,
  handleCoreInviteProcess,
  handleNonCoreInviteProcess,
  processInvitePrechecks,
} from "../../../server/functions/server-invite";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const { userId } = getAuth(req);
      const user = await getUser(userId!);
      if (!user) throw new Error("user-not-found");

      sentry.setUser({ id: user.id, email: user.email, username: user.name });

      await cacheRedisHandler.invalidate.single("user-data", user.id);
      const { invite, token } = await getInviteAndToken(req);

      sentry.setContext("api/invite/join", { invite, token });

      const { validatedToken, doesNotNeedToRedoCoreInviteProcess } =
        await processInvitePrechecks({
          invite,
          userId: user.id,
          token,
          email: user.email,
        });

      if (doesNotNeedToRedoCoreInviteProcess) {
        await handleNonCoreInviteProcess({
          userId: user.id,
          institutionId: invite.institution_id,
          invite,
        });
        return res.json({
          success: true,
          result: "Invite completed",
        } satisfies InviteResponse);
      }

      const checkoutSessionLink = await handleAccessPassPayment({
        invite,
        token,
        userId: user.id,
      });

      if (checkoutSessionLink) {
        return res.json({
          success: true,
          result: checkoutSessionLink,
          resultType: "redirect",
        } satisfies InviteResponse);
      }

      await handleCoreInviteProcess({
        institutionId: invite.institution_id,
        userId: user.id,
        invite,
        validatedToken,
      });

      const newUserData = await handleAfterInviteCompleted({
        invite,
        userId: user.id,
        validatedToken,
      });

      return res.json({
        success: true,
        result: "Invite completed",
        updatedUser: newUserData,
      } satisfies InviteResponse);
    } catch (error) {
      sentry.captureException(error);

      return res.json({
        success: false,
        error: (error as Error).message as InviteError,
      } satisfies InviteResponse);
    }
  }
  return res.status(400).json("Method Invalid, Asshole Son.");
}
