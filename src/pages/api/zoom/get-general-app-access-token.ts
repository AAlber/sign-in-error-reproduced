import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  getInstitutionSettings,
  isVideoChatProviderEnabled,
} from "@/src/server/functions/server-institution-settings";
import { isAdminOfInstitution } from "@/src/server/functions/server-role";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import { updateZoomDetailsInstitutionSettings } from "@/src/server/functions/server-video-chat-providers/server-zoom";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const data = JSON.parse(req.body) as {
      code: string;
      redirect_uri: string;
    };
    const { userId } = getAuth(req);

    if (!data.code || !data.redirect_uri)
      return res.status(400).json({ message: "Invalid data" });

    const institutionId = await getCurrentInstitutionId(userId!);
    if (!institutionId)
      return res.status(400).json({ message: "No institution selected" });

    if (!(await isAdminOfInstitution(userId!, institutionId))) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const institutionSettings = await getInstitutionSettings(institutionId);
    const isEnabled = isVideoChatProviderEnabled(
      "zoom",
      institutionSettings.videoChatProviders,
    );

    if (!isEnabled)
      return res.status(405).json({
        message: "The Zoom integration is not enabled",
      });

    try {
      const updated = await updateZoomDetailsInstitutionSettings(
        data.code,
        data.redirect_uri,
        institutionId,
      );
      if (!updated) {
        return res.status(500).json({
          message: "Internal server error generating Zoom access token",
        });
      }
      return res.status(200).json({
        message: "Succesfully authenticated using Zoom OAuth",
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
