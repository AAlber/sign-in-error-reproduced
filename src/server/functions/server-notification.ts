import type { Notification as DatabaseNotification } from "@prisma/client";
import axios from "axios";
import { deepCopy } from "@/src/client-functions/client-utils";
import { env } from "@/src/env/server.mjs";
import type {
  Notification,
  NotificationIcon,
  NotificationSendRequest,
} from "@/src/types/notification.types";
import { log } from "@/src/utils/logger/logger";
import { boostedPrisma, prisma } from "../db/client";
import { sendMobileNotification } from "./server-mobile-notification";

const axiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : env.SERVER_URL,
  headers: {
    Authorization: `Bearer ${env.FUXAM_SECRET}`,
  },
});

/**
 * Sends a notification using the axiosInstance.
 *
 * @param {string} url - The URL to send the notification to.
 * @param {any} data - The data payload of the notification.
 * @returns {Promise<void>} - A promise that resolves when the notification is sent.
 */
async function sendNotification(url: string, data: any): Promise<void> {
  try {
    const response = await axiosInstance.post(url, data);
    if (response.status !== 200) {
      throw new Error(response.data.message);
    }
  } catch (error) {
    // Implement improved error handling here
    console.error(error);
  }
}

interface NotificationHandler {
  /**
   * Builds notification and calls `sendToUsers`
   *
   * @param {data} NotificationSendRequest
   */
  send: (data: NotificationSendRequest) => Promise<void>;

  get: {
    /**
     * Retrieves all notifications for a user.
     *
     * @param {string} userId - The ID of the user to retrieve notifications for.
     * @returns {Promise<DatabaseNotification[]>} - A promise that resolves with an array of notifications.
     */
    all: (userId: string) => Promise<DatabaseNotification[]>;
    /**
     * Retrieves the count of notifications for a user.
     *
     * @param {string} userId - The ID of the user to retrieve the count for.
     * @returns {Promise<{ notifications: number; unreadNotifications: number }>} - A promise that resolves with the count of notifications.
     */
    count: (userId: string) => Promise<{ unreadNotifications: number }>;
  };

  delete: {
    /**
     * Deletes all notifications for a user.
     *
     * @param {string} userId - The ID of the user to delete notifications for.
     * @returns {Promise<void>} - A promise that resolves when the notifications are deleted.
     */
    all: (userId: string) => Promise<void>;
    /**
     * Deletes a notification for a user.
     *
     * @param {string} userId - The ID of the user to delete the notification for.
     * @param {string} notificationId - The ID of the notification to delete.
     * @returns {Promise<void>} - A promise that resolves when the notification is deleted.
     */
    single: (userId: string, notificationId: string) => Promise<void>;
  };
  /**
   * Creates notifications for multiple users.
   *
   * @param {string[]} userIds - An array of user IDs to create notifications for.
   * @param {Notification} notification - The notification object to create.
   * @returns {Promise<void>} - A promise that resolves when the notifications are created.
   */
  sendToUsers: (userIds: string[], notification: Notification) => Promise<void>;

  /**
   * Marks all notifications as read for a user.
   *
   * @param {string} userId - The ID of the user to mark notifications as read for.
   * @returns {Promise<void>} - A promise that resolves when the notifications are marked as read.
   */
  markAllAsRead: (userId: string) => Promise<void>;
  create: () => NotificationBuilder;
}

class NotificationService implements NotificationHandler {
  get = {
    all: async (userId: string): Promise<DatabaseNotification[]> => {
      log.info("Get all notifications", userId);
      const notifications = await prisma.notification.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return notifications;
    },
    count: async (userId: string): Promise<{ unreadNotifications: number }> => {
      log.info("Count notifications", userId);
      const unreadNotifications = await boostedPrisma.notification.count({
        where: {
          userId,
          read: false,
        },
      });

      return { unreadNotifications };
    },
  };

  send = async (data: NotificationSendRequest): Promise<void> => {
    log.info("Request to send notification endpoint", data);
    await sendNotification("/api/notifications/send", data);
  };

  delete = {
    all: async (userId: string): Promise<void> => {
      log.info("Delete all notifications", userId);
      await prisma.notification.deleteMany({
        where: {
          userId,
        },
      });
    },
    single: async (userId: string, notificationId: string): Promise<void> => {
      log.info("Delete a single notification", { userId, notificationId });
      const notification = await prisma.notification.findFirst({
        where: {
          id: notificationId,
          userId,
        },
      });

      if (!notification) {
        log.error("Notification not found", notificationId);
        throw new Error("Notification not found");
      }

      await prisma.notification.deleteMany({
        where: {
          id: notificationId,
          userId,
        },
      });
    },
  };

  sendToUsers = async (
    userIds: string[],
    notification: Notification,
  ): Promise<void> => {
    log.info("Sending notification to users", { userIds, notification });
    const sanitizedNotification = this.sanitizeNotification(notification);
    await prisma.notification.createMany({
      data: userIds.map((userId) => ({
        userId,
        data: sanitizedNotification,
      })),
    });
    await sendMobileNotification(userIds, notification);
  };

  markAllAsRead = async (userId: string): Promise<void> => {
    log.info("Marked as all read notifications", userId);
    await prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: {
        read: true,
      },
    });
  };

  /**
   * Sanitizes a notification object by removing potentially malicious characters from string values.
   *
   * @private
   * @param {Notification} notification - The notification object to sanitize.
   * @returns {Notification} - The sanitized notification object.
   */
  private sanitizeNotification(notification: Notification): Notification {
    const sanitizedNotification = deepCopy(notification);
    for (const key in sanitizedNotification) {
      if (typeof sanitizedNotification[key] === "string") {
        sanitizedNotification[key] = sanitizedNotification[key]
          .replace(/[<>&'"]/g, "")
          .trim();
      }
    }

    return sanitizedNotification;
  }

  create = (): NotificationBuilder => {
    return new NotificationBuilder();
  };
}

class NotificationBuilder {
  private notification: Partial<Notification> = {};

  withIcon(icon: NotificationIcon): NotificationBuilder {
    this.notification.icon = icon;
    return this;
  }

  withTitle(title: string): NotificationBuilder {
    this.notification.title = title;
    return this;
  }

  withMessage(message: string): NotificationBuilder {
    this.notification.message = message;
    return this;
  }

  withMessageValues(messageValues: {
    [key: string]: string;
  }): NotificationBuilder {
    this.notification.messageValues = messageValues;
    return this;
  }

  build(): Notification {
    // ensures all required properties are initialized properly
    if (
      !this.notification.title ||
      !this.notification.message ||
      !this.notification.icon
    ) {
      throw new Error("Missing required notification properties");
    }

    return this.notification as Notification;
  }
}

export default NotificationService;

export const sendPublishedContentBlockNotification = async (
  layerIds: string[],
  cbName: string,
  courseId: string,
) => {
  const notificationRequest: NotificationSendRequest = {
    icon: {
      type: "info",
    },
    messageTitle: "notification.new_task_title",
    messageText: "notification.new_task_desc",
    recipients: {
      defineBy: "role",
      roles: ["member"],
      layerIds,
    },
    asyncData: {
      course: courseId,
    },
    data: {
      cbName,
    },
  };
  log.info(
    "Sending published content block notification. Notification request:",
    notificationRequest,
  );

  const service = new NotificationService();
  await service.send(notificationRequest);
};

export const sendHandInGroupWorkSelectionNotification = async (
  cbName: string,
  courseId: string,
  recipientId: string,
  userId: string,
) => {
  const notificationRequest: NotificationSendRequest = {
    icon: {
      type: "info",
    },
    messageTitle: "notification.selected_hand_in_by_peer_title",
    messageText: "notification.selected_hand_in_by_peer_desc",
    recipients: {
      defineBy: "userIds",
      ids: [recipientId],
    },
    asyncData: {
      course: courseId,
      user: userId,
    },
    data: {
      cbName,
    },
  };
  log.info(
    "Sending selected peer's hand in notification. Notification request:",
    notificationRequest,
  );
  const service = new NotificationService();
  await service.send(notificationRequest);
};
