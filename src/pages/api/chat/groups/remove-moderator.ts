import type { NextApiRequest, NextApiResponse } from "next";
import { demoteMemberAsModerator } from "@/src/server/functions/server-chat/user-group-management";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const data = JSON.parse(req.body);
    const { userId, channelId, channelType } = data;
    if (!userId || !channelId) throw new Error("Invalid Request");

    const result = await demoteMemberAsModerator(
      userId,
      channelId,
      channelType,
    );

    res.json(result);
  } catch (e) {
    console.log(e);
  }
}
