import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { streamChat } from "@/src/server/functions/server-chat";
import { retry } from "@/src/utils/utils";
import { prisma } from "../../../server/db/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const { userId } = getAuth(req);
      if (!userId) {
        throw new Error("Unauthorized");
      }

      const { email, institution, name } = await retry(
        () => {
          return prisma.user.findFirstOrThrow({
            where: {
              id: userId,
            },
            select: {
              name: true,
              email: true,
              institution: {
                select: {
                  id: true,
                },
              },
            },
          });
        },
        {
          retries: 5,
          retryIntervalMs: 1500,
        },
      );

      if (!institution) {
        throw new Error("User is not part of an institution");
      }

      const { users: streamChatUsers } = await streamChat.queryUsers({
        id: userId,
      });

      const [user] = streamChatUsers;
      const userTeams = user?.teams ?? []; // empty if new user
      const isNewUser =
        !!!userTeams.length || !userTeams.includes(institution.id);

      if (isNewUser) {
        const user_id = userId;
        const teams = [...userTeams, institution.id];

        await streamChat.upsertUser({
          id: user_id,
          name,
          email,
          teams,
          role: "user",
        });

        await streamChat.channel("team", institution.id).addMembers([
          {
            user_id,
          },
        ]);
      }

      res.json({ success: true });
    } catch (e) {
      console.log("getstream-chat: From add institution chat: ", { e });
      const error = e as Error;
      res.status(400).json(error.message);
    }
  }
}
