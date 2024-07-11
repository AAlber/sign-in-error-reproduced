import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { deleteChatChannel } from "@/src/server/functions/server-chat";
import {
  deleteInstitutionRooms,
  getInstitutionRoomsFromIds,
} from "@/src/server/functions/server-institution-room";
import { isValidCuid } from "../../../server/functions/server-input";
import { getAllRolesFromUser } from "../../../server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const data = JSON.parse(req.body);
    const { userId } = getAuth(req);

    if (!data.ids) {
      res.status(400).json({ message: "Invalid data" });
      return;
    }

    const roomIds = data.ids as string[];

    if (roomIds.length === 0) {
      res.status(400).json({ message: "No room ids provided" });
      return;
    }

    if (!roomIds.every((id) => isValidCuid(id)))
      return res.status(400).json({ message: "Invalid room ids" });

    const roles = await getAllRolesFromUser(userId!);
    const rooms = await getInstitutionRoomsFromIds(roomIds);
    const institutionIds = rooms.map((room) => room.institutionId);

    if (
      !institutionIds.every((id) =>
        roles.some(
          (role) => role.institutionId === id && role.role === "admin",
        ),
      )
    ) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const request = await deleteInstitutionRooms(roomIds);

    const getStreamJobs = roomIds.map((id) => deleteChatChannel(id));
    await Promise.all(getStreamJobs);

    return res.json(request);
  }
}
