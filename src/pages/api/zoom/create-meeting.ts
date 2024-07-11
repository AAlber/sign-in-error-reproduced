import { getAuth } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  getInstitutionSettings,
  isVideoChatProviderEnabled,
} from "@/src/server/functions/server-institution-settings";
import { hasRolesWithAccess } from "@/src/server/functions/server-role";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import {
  createZoomMeeting,
  getZoomAccessToken,
} from "@/src/server/functions/server-video-chat-providers/server-zoom";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const data = JSON.parse(req.body) as {
      layerIds: string[];
      title: string;
      dateTime: string;
      duration: number;
      timezone: string;
    };
    const { userId } = getAuth(req);

    if (!data.layerIds || !data.title || !data.duration)
      return res.status(400).json({ message: "Invalid data" });

    const institutionId = await getCurrentInstitutionId(userId!);
    if (!institutionId)
      return res.status(400).json({ message: "No institution selected" });

    if (
      !(await hasRolesWithAccess({
        layerIds: data.layerIds,
        rolesWithAccess: ["admin", "moderator", "educator"],
        userId: userId!,
      }))
    ) {
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
      const token = await getZoomAccessToken(institutionId);

      if (!token) {
        return res
          .status(500)
          .json({ message: "Internal server error when fetching Zoom token" });
      }

      const zoomMeeting = await createZoomMeeting(
        data.title,
        token,
        data.duration,
        data.timezone,
      );

      return res.status(200).json({
        created_at: zoomMeeting.created_at,
        duration: zoomMeeting.duration,
        start_url: zoomMeeting.start_url,
        join_url: zoomMeeting.join_url,
        timezone: zoomMeeting.timezone,
      });
    } catch (e) {
      console.error(e);
      Sentry.captureException(e);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
