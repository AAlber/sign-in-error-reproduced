import { getAuth } from "@clerk/nextjs/server";
import axios from "axios";
import bbb from "bigbluebutton-js";
import cuid from "cuid";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  getInstitutionSettings,
  isVideoChatProviderEnabled,
} from "@/src/server/functions/server-institution-settings";
import { hasRolesWithAccess } from "@/src/server/functions/server-role";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";

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
    };
    const { userId } = getAuth(req);

    if (!data.layerIds || !data.title || !data.duration)
      return res.status(400).json({ message: "Invalid data" });

    const institutionId = await getCurrentInstitutionId(userId!);
    if (!institutionId)
      return res.status(400).json({ message: "No institution selected" });

    const institutionSettings = await getInstitutionSettings(institutionId);
    const isEnabled = isVideoChatProviderEnabled(
      "bbb",
      institutionSettings.videoChatProviders,
    );

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

    if (
      !isEnabled ||
      !institutionSettings.bigbluebutton_api_url ||
      !institutionSettings.bigbluebutton_api_secret
    )
      return res.status(405).json({
        message: "The BigBlueButton integration is not enabled or configured",
      });

    try {
      const api = bbb.api(
        institutionSettings.bigbluebutton_api_url,
        institutionSettings.bigbluebutton_api_secret,
      );

      const id = cuid();
      const password = cuid();
      const moderatorPassword = cuid();
      const meetingCreateUrl = api.administration.create(data.title, id, {
        duration: data.duration,
        attendeePW: password,
        moderatorPW: moderatorPassword,
      });

      await axios(meetingCreateUrl).then((response) => {
        const moderatorUrl = api.administration.join(
          "moderator",
          id,
          moderatorPassword,
          {},
        );

        const attendeeUrl = api.administration.join(
          "attendee",
          id,
          password,
          {},
        );

        return res.status(200).json({
          modUrl: moderatorUrl,
          url: attendeeUrl,
        });
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
