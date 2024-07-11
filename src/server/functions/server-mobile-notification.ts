import * as Sentry from "@sentry/nextjs";
import axios from "axios";
import fs from "fs/promises";
import { google } from "googleapis";
import i18n from "i18next";
import type { FsBackendOptions } from "i18next-fs-backend";
import Backend from "i18next-fs-backend";
import path from "path";
import type { Notification } from "@/src/types/notification.types";
import { log } from "@/src/utils/logger/logger";
import { prisma } from "../db/client";

/**
 * Re-initializes i18next for mobile notification
 * (server-side) use
 */
const reInitializei18next = async () => {
  const enFile = await fs.readFile(
    path.join(process.cwd(), `/src/translations/en.json`),
    "utf-8",
  );
  const deFile = await fs.readFile(
    path.join(process.cwd(), `/src/translations/de.json`),
    "utf-8",
  );

  await i18n.use(Backend).init<FsBackendOptions>({
    fallbackLng: "en",
    ns: "page",
    resources: {
      en: {
        page: JSON.parse(enFile),
      },
      de: {
        page: JSON.parse(deFile),
      },
    },
  });
};

// Defines constants for Firebase Messaging scope.
const MESSAGING_SCOPE = "https://www.googleapis.com/auth/firebase.messaging";
const SCOPES = [MESSAGING_SCOPE];

/**
 * Asynchronously retrieves an access token for Firebase Cloud Messaging.
 *
 * @returns {Promise<string>} A promise that resolves to the access token.
 */
export function getAccessToken() {
  return new Promise(function (resolve, reject) {
    const key = process.env.CLOUD_MESSAGING_FIREBASE_KEY!.replace(/\\n/g, "\n");
    const jwtClient = new google.auth.JWT({
      email: "firebase-adminsdk-f7twx@fuxam-mobile-app.iam.gserviceaccount.com",
      key: key,
      scopes: SCOPES,
    });
    jwtClient.authorize(function (err, tokens) {
      if (err) {
        reject(err);
        return;
      }
      resolve(tokens!.access_token);
    });
  });
}

/**
 * Sends a notification to Firebase Cloud Messaging (FCM) for a user determined by their userToken
 *
 * @param {NotificationMessage} title - The translated title of the notification.
 * @param {NotificationMessage} body - The translated message of the notification.
 * @param {string} accessToken - Access token for FCM.
 * @param {string} userToken - Individual user token for FCM.
 * @returns {Promise<void>} A promise that resolves when the notification has been sent.
 */
export const postToFCM = async (
  title: string,
  body: string,
  accessToken?: string,
  userToken?: string,
) => {
  if (!accessToken) {
    console.error(`Access token not found`);
    return;
  }

  if (!userToken) {
    console.error(`User token not found`);
    return;
  }

  try {
    await axios.post(
      "https://fcm.googleapis.com/v1/projects/fuxam-mobile-app/messages:send",
      JSON.stringify({
        message: {
          token: userToken,
          notification: {
            title,
            body,
          },
        },
      }),
      {
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (e) {
    console.error("Error sending mobile notification");
  }
};

/**
 * Retrieves the FCM token associated with a user ID.
 *
 * @param {string} userId - The user ID to fetch the token for.
 * @returns {Promise<string>} A promise that resolves to the FCM token.
 */
export const getUserToken = async (userId: string) => {
  const user = await prisma.userNotificationPushToken.findUnique({
    where: {
      userId,
    },
    select: {
      token: true,
    },
  });

  return user?.token;
};

/**
 * Retrieves the preferred device language of the user.
 *
 * @param {string} userId - The user ID to fetch the device language for.
 * @returns {Promise<string>} A promise that resolves to the device language.
 */
export const getUserDeviceLanguage = async (userId: string) => {
  const user = await prisma.userNotificationPushToken.findUnique({
    where: {
      userId,
    },
    select: {
      language: true,
    },
  });

  return user?.language;
};

/**
 * Sends a mobile notification to a list of user IDs.
 *
 * @param {string[]} userIds - The user IDs to send notifications to.
 * @param {Notification} notification - The notification object containing the message details.
 * @returns {Promise<void>} A promise that resolves when the notification is sent.
 */
export const sendMobileNotification = async (
  userIds: string[],
  notification: Notification,
) => {
  log.info("Sending mobile notification", { userIds, notification });

  const accessToken = (await getAccessToken()) as string;
  await reInitializei18next();

  for (const userId of userIds) {
    const userToken = await getUserToken(userId);
    const userLanguage = await getUserDeviceLanguage(userId);

    await i18n.changeLanguage(userLanguage);
    let title = i18n
      .t(`page:${notification.title}`, { returnObjects: true })
      .toString();
    let body = i18n
      .t(`page:${notification.message}`, {
        returnObjects: true,
      })
      .toString();

    if (typeof title === "string") {
      title = replaceTemplateStrings(title, notification.messageValues);
    }

    if (typeof body === "string") {
      body = replaceTemplateStrings(body, notification.messageValues);
    }

    log.info("Sending mobile notification with translated title and body", {
      title,
      body,
      userId,
    });

    console.log(
      `Sending mobile notification to ${userId}. \n Title: ${title} \n Body: ${body}`,
    );

    await postToFCM(title, body, accessToken, userToken);
  }
};

/**
 * Creates or updates a user's notification token and preferred language.
 *
 * @param {string} userId - The user ID for which to upsert the token.
 * @param {string} token - The notification token to be saved or updated.
 * @param {string} language - The preferred language of the user.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
export const createUpdateUserToken = async (
  userId: string,
  token: string,
  language: string,
) => {
  try {
    const operation = await prisma.userNotificationPushToken.upsert({
      where: {
        userId,
      },
      update: {
        token,
        language,
      },
      create: {
        userId,
        token,
        language,
      },
    });

    Sentry.addBreadcrumb({
      message: "Creating or updating user token",
      data: { operation },
    });
    console.log("Creating or updating user token", operation);
  } catch (error) {
    console.log("Error creating or updating user token", error);
    Sentry.captureException(error);
  }
};

/** To perform template replacement for the mobile push notification title & body*/
const replaceTemplateStrings = (
  body: string,
  values: { [key: string]: any }, // to allow for nested translation key (e.g: {{course.name}})
) => {
  return body.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
    const keyParts = key.split(".");
    let currentValue: any = values;
    for (const part of keyParts) {
      if (
        currentValue &&
        typeof currentValue === "object" &&
        part in currentValue
      ) {
        currentValue = currentValue[part];
      } else {
        return match;
      }
    }
    if (
      typeof currentValue === "object" &&
      currentValue !== null &&
      !Array.isArray(currentValue)
    ) {
      return match;
    }
    return typeof currentValue === "undefined" ? match : String(currentValue);
  });
};
