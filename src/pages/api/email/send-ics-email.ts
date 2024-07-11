import * as ics from "ics";
import type { NextApiRequest, NextApiResponse } from "next";
import Nodemailer from "nodemailer";
import { Resend } from "resend";
import { getUsersWithAccessToAppointment } from "@/src/server/functions/server-appointment";
import { getUsersByIds } from "@/src/server/functions/server-user";
import { getAppointmentInvitationEmailsOfUsers } from "@/src/server/functions/server-user-integrations";
import { sentry } from "@/src/server/singletons/sentry";
import type { ScheduleAppointment } from "@/src/types/appointment.types";
import { log } from "@/src/utils/logger/logger";

export const resend = new Resend(process.env.RESEND as string);

const transport = Nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  secure: true,
  port: 465,
  auth: {
    user: "apikey",
    // TODO: store it in doppler
    pass: "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",
  },
});

export type IcsEmailData = {
  appointment: ScheduleAppointment & {
    rRule?: string;
  };
  operation:
    | { type: "create" }
    | { type: "update" | "delete"; eventOfSeriesDate?: Date };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    log.info("SENDING ICS EMAIL", { method: req.method });
    if (!req.headers.authorization) {
      return res.status(401).send("No authorization token");
    }

    if (req.headers.authorization !== "Bearer " + process.env.FUXAM_SECRET) {
      return res.status(401).send("Unauthorized");
    }

    if (req.method !== "POST") {
      log.error(`METHOD NOT ALLOWED ${req.method || "LOL"}`);
      return res.status(405).end("Method Not Allowed");
    }

    const { appointment, operation }: IcsEmailData = req.body;

    const organizers = await getUsersByIds(
      appointment.organizerUsers.map((user) => user.organizerId),
    );

    const users = await getUsersWithAccessToAppointment(appointment.id);

    const usersAppointmentEmail = await getAppointmentInvitationEmailsOfUsers([
      ...users.map((user) => user.id),
      ...organizers.map((user) => user.id),
    ]);

    const attendeeEmails = usersAppointmentEmail.map((user) => user.email);

    const icsContent = convertAppointmentToICS(
      {
        ...appointment,
        // we just take the first organizer email to make this work
        organizerEmail: "random@random.com",
        // invite all attendees and organizers so they see the event in their calendar
        attendeeEmails: attendeeEmails,
      },
      operation,
    );

    await transport.sendMail({
      from: "no-reply@fuxam.de",
      to: attendeeEmails,
      subject: "Your invite to the meeting",
      text: "Welcome to the event",
      html: "<h1>Fuxam invitation</h1>",
      icalEvent: {
        filename: "invite.ics",
        method: operation.type === "delete" ? "CANCEL" : "REQUEST",
        content: Buffer.from(icsContent, "utf-8"),
      },
      headers: {
        "Content-Disposition": "attachment; filename=invite.ics",
      },
    });

    res.status(200).json({ message: "Email sent" });
  } catch (error) {
    sentry.captureException(error);
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const convertAppointmentToICS = (
  appointment: ScheduleAppointment & {
    organizerEmail: string;
    attendeeEmails: string[];
    rRule?: string;
  },
  operation: IcsEmailData["operation"],
): string => {
  // Function to format dates in UTC for ICS
  const formatICSDate = (date: Date) => {
    const d = new Date(date);
    return d.toISOString().replace(/-|:|\.\d{3}/g, "");
  };

  const startTime = formatICSDate(appointment.dateTime);

  const event: ics.EventAttributes = {
    uid: appointment.seriesId ? appointment.seriesId : appointment.id,
    method: operation.type === "delete" ? "CANCEL" : "REQUEST",
    start: startTime,
    status: operation.type === "delete" ? "CANCELLED" : "CONFIRMED",
    // sequence: operation.type === "update" ? 1 : 0,
    end: formatICSDate(
      new Date(
        new Date(appointment.dateTime).getTime() + appointment.duration * 60000,
      ),
    ),
    title: appointment.title,
    description: `Fuxam Meeting\n\nJoin Meeting\n${
      appointment.location ?? "N/A"
    }`,
    location: appointment.location ?? "N/A",
    organizer: { email: appointment.organizerEmail, name: "Organizer" },
    attendees: appointment.attendeeEmails.map((email) => ({
      cutype: "INDIVIDUAL",
      email,
      name: "Attendee",
      rsvp: true,
      partstat: "NEEDS-ACTION",
      role: "REQ-PARTICIPANT",
    })),
    alarms: [
      {
        action: "display",
        description: "This is an event reminder",
        trigger: { minutes: 30 },
      },
    ],
    recurrenceRule: appointment.rRule
      ? appointment.rRule.split("RRULE:")[1]
      : undefined,
  };

  const { value, error } = ics.createEvent(event);

  if (error || !value) {
    throw error;
  }

  if (operation.type === "create" || !operation.eventOfSeriesDate) return value;

  const reccurenceId = formatICSDate(operation.eventOfSeriesDate);

  const recurrenceId = `RECURRENCE-ID;${reccurenceId}\r\n`;
  const modifiedValue = value.replace(
    "END:VEVENT",
    `${recurrenceId}END:VEVENT`,
  );

  return modifiedValue;
};
