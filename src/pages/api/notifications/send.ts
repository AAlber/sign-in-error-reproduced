import type { NextApiRequest, NextApiResponse } from "next";
import { getLayerWithCourse } from "@/src/server/functions/server-administration";
import { getAppointment } from "@/src/server/functions/server-appointment";
import { getContentBlock } from "@/src/server/functions/server-content-block";
import NotificationService from "@/src/server/functions/server-notification";
import { getUserIdsWithRolesInMultipleLayers } from "@/src/server/functions/server-role";
import { getUser } from "@/src/server/functions/server-user";
import type { NotificationSendRequest } from "@/src/types/notification.types";
import type { HttpError } from "@/src/utils/exceptions/http-error";
import { log } from "@/src/utils/logger/logger";

/**
 * API route handler for sending notifications.
 *
 * @param {NextApiRequest} req - The Next.js API request object.
 * @param {NextApiResponse} res - The Next.js API response object.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method === "POST") {
    // Check for authorization token
    if (!req.headers.authorization) {
      res.status(401).send("No authorization token");
      return;
    }

    // Verify the authorization token
    if (req.headers.authorization !== "Bearer " + process.env.FUXAM_SECRET) {
      res.status(401).send("Unauthorized");
      return;
    }

    try {
      // Extract the notification request from the request body (infer type)
      const notificationRequest = req.body as NotificationSendRequest;

      log.context("Notification send endpoint", notificationRequest);

      // Fetch async data based on the provided keys
      const asyncData: Record<string, any> = {};
      for (const key in notificationRequest.asyncData) {
        const asyncDataKey = key as keyof typeof notificationRequest.asyncData;
        const asyncDataValue = notificationRequest.asyncData[asyncDataKey];

        if (asyncDataValue) {
          switch (asyncDataKey) {
            case "course":
              const course = await getLayerWithCourse(asyncDataValue);
              if (!course) {
                res.status(404).json({ message: "Course not found" });
                return;
              }
              asyncData.course = course;
              break;
            case "block":
              const block = await getContentBlock(asyncDataValue);
              if (!block) {
                res.status(404).json({ message: "Content block not found" });
                return;
              }
              asyncData.block = block;
              break;
            case "user":
              const user = await getUser(asyncDataValue);
              if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
              }
              asyncData.user = user;
              break;
            case "appointment":
              const appointment = await getAppointment(asyncDataValue);
              if (!appointment) {
                res.status(404).json({ message: "Appointment not found" });
                return;
              }
              asyncData.appointment = appointment;
              break;
          }
        }
      }

      log.info("asyncData values:", asyncData);

      // Get the recipient user IDs based on the provided criteria
      let userIds: string[] = [];
      if (notificationRequest.recipients.defineBy === "role") {
        const { roles, layerIds } = notificationRequest.recipients;
        userIds = await getUserIdsWithRolesInMultipleLayers(layerIds, roles);
      } else if (notificationRequest.recipients.defineBy === "userIds") {
        userIds = notificationRequest.recipients.ids;
      }

      log.info("recipient userIds: ", userIds);

      // Create an instance of the NotificationService
      const service = new NotificationService();

      // Build the notification using the NotificationService
      const notificationBuilder = service
        .create()
        .withIcon(notificationRequest.icon)
        .withTitle(notificationRequest.messageTitle)
        .withMessage(notificationRequest.messageText)
        .withMessageValues({
          ...asyncData,
          ...notificationRequest.data,
        });

      const notification = notificationBuilder.build();

      log.info("notification built, ready for sending: ", notification);

      // Send the notification to the recipient user IDs
      await service.sendToUsers(userIds, notification);
      log.info("notification sent");
      res.json({ message: "Notification sent" });
    } catch (e) {
      log.error(e);
      const err = e as HttpError;
      res.status(err.status || 500).json({
        success: false,
        message: err.message || "Failed sending notification",
      });
    }
  }
}
