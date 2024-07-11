import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import { getWidgetData } from "@/src/server/functions/server-widgets";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const id = req.query.id as string;

    if (!id) return res.status(400).json({ error: "No id provided" });

    const { userId } = await getAuth(req);
    const institutionId = await getCurrentInstitutionId(userId!);

    if (!institutionId) {
      return res.status(400).json({ error: "No institutionId provided" });
    }

    getWidgetData(id, institutionId)
      .then((data) => {
        return res.status(200).json(data);
      })
      .catch((error) => {
        return res.status(400).json({ error: error.message });
      });
  }
}
