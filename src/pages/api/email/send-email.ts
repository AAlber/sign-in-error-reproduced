import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";
import { getSettingValues } from "@/src/server/functions/server-institution-settings";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import { sentry } from "@/src/server/singletons/sentry";
import type { EmailInfo } from "@/src/types/email.types";

export const resend = new Resend(process.env.RESEND as string);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (!req.headers.authorization) {
      return res.status(401).send("No authorization token");
    }

    if (req.headers.authorization !== "Bearer " + process.env.FUXAM_SECRET) {
      return res.status(401).send("Unauthorized");
    }

    if (req.method !== "POST") {
      return res.status(405).end("Method Not Allowed");
    }

    const { from, to, subject, content, userId, language }: EmailInfo =
      req.body;
    const contentString = content as string;
    let institutionLanguage = language;
    if (userId) {
      const institutionId = await getCurrentInstitutionId(userId);
      if (!institutionId) {
        return res.status(400).end("No institution selected");
      }
      const getInstitutionLanguage = await getSettingValues(institutionId, [
        "institution_language",
      ]);

      institutionLanguage = getInstitutionLanguage.institution_language;
    }
    if (!institutionLanguage) {
      return res.status(400).end("No institution language");
    }

    const translatedSubject = subject[institutionLanguage];

    if (!content) {
      return res.status(400).end("No content");
    }

    const { data, error } = await resend.emails.send({
      from: from,
      to: to,
      subject: translatedSubject,
      html: contentString,
    });

    if (error) {
      sentry.captureException(error);
      res.status(400).json(error);
    } else {
      res.status(200).json(data);
    }
  } catch (error) {
    sentry.captureException(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
