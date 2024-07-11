import type { JsonObject } from "@prisma/client/runtime/library";
import * as Sentry from "@sentry/nextjs";
import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import type { NextApiRequest, NextApiResponse } from "next";
import { twMerge } from "tailwind-merge";
import type { FuxamStripeSubscription } from "./stripe-types";

export const UNFINISHED_ARTICLE_ID = 9167702;

export const supportedFileTypesForFileViewer = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

export const supportedFileTypesForAI = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

export const imageFileTypes = [
  "image/*",
  ".jpg",
  ".jpeg",
  ".png",
  ".svg",
  ".gif",
];

export const documentFileTypes = [
  "text/plain",
  "text/csv",
  "text/html",
  "text/css",
  "application/rtf",
  "application/msword",
  "application/vnd.ms-excel",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.oasis.opendocument.text",
  "application/vnd.oasis.opendocument.spreadsheet",
  "application/vnd.oasis.opendocument.presentation",
  "application/pdf",
  "application/x-latex",
  "application/vnd.apple.pages",
  "application/vnd.apple.numbers",
  "application/vnd.apple.keynote",
];

export const supportedSpreadSheetFileTypes = [
  ".csv",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
];

export const maxFileSizes = {
  icons: 4 * 1024 * 1024, //4 mb
  images: 26214400, //25 mb
  files: 104857600, //100 mb
  fallback: 314572800, //300 mb
};

export function getMaxFileSizeInfo(size: number) {
  // Map the sizes to their corresponding names and human-readable formats
  const sizeMap = {
    [maxFileSizes.icons]: { name: "icons", size: "4 mb" },
    [maxFileSizes.images]: { name: "images", size: "25 mb" },
    [maxFileSizes.files]: { name: "files", size: "100 mb" },
    [maxFileSizes.fallback]: { name: "fallback", size: "300 mb" },
  };

  // Return the corresponding value or a default one if not found
  return sizeMap[size] || { name: "unknown", size: "Size not found" };
}

export function getFullLanguageName(language: Language) {
  switch (language) {
    case "en":
      return "English";
    case "de":
      return "German";
    default:
      return language;
  }
}

export function chunkAndCleanText(pdfText: string): string[] {
  const pattern = /[^a-zA-Z0-9.,?1()\/\s]/g;
  const cleanedText = pdfText.replace(pattern, "");
  const words = cleanedText.split(" ");

  // Initialize an array to store the chunks
  const chunks: string[] = [];

  // Loop through the words and create chunks of up to 100 words
  for (let i = 0; i < words.length; i += 100) {
    const chunk = words.slice(i, i + 100);
    chunks.push(chunk.join(" "));
  }

  return chunks;
}

export function isJsonObject(value: any): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isString(value: any): value is string {
  return typeof value === "string";
}

export function removeDuplicates(array: any[]): any[] {
  return Array.from(new Set(array));
}

export function isStringArray(arr: any): arr is string[] {
  if (!Array.isArray(arr)) return false;
  return arr.every((element) => typeof element === "string");
}

interface MyObject {
  [key: string]: any; // Adjust the type according to your object structure
}

export function getLastDuplicates(
  array: MyObject[],
  key: string,
  valueToFind: any,
): MyObject[] | null {
  const filteredArray = array.filter((item) => item[key] === valueToFind);

  if (filteredArray.length > 1) {
    // Remove the first occurrence if more than one occurrence is found
    filteredArray.shift();
    return filteredArray;
  } else {
    // Return null if only one or no occurrence is found
    return null;
  }
}

const isDevelopment =
  process.env.NEXT_PUBLIC_SERVER_URL !== "https://fuxam.app/";
const allowedOrigins = ["https://fuxam.app", "https://mobile.fuxam.app"];

export const respondToPreflightRequest = (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const origin = req.headers["origin"];
  if ((origin && allowedOrigins.includes(origin)) || isDevelopment) {
    res.setHeader(
      "Access-Control-Allow-Origin",
      !isDevelopment && origin ? origin : "*",
    );
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS, GET");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
    // Uncomment the following line if you need credentials to be included in CORS requests
    // res.setHeader("Access-Control-Allow-Credentials", "true");

    return res.status(200).send("OK");
  } else {
    // Optionally handle the case where the origin is not allowed
    return res.status(403).send("Origin not allowed");
  }
};

export const respondToPreflightEdgeRequest = (request) => {
  const origin = request.headers.get("origin");

  // Create a new Headers instance for the response
  const headers = new Headers();
  headers.append("Access-Control-Allow-Methods", "POST, OPTIONS, GET");
  headers.append("Access-Control-Allow-Headers", "Content-Type, Authorization");
  // Conditionally set the Access-Control-Allow-Origin header
  if ((origin && allowedOrigins.includes(origin)) || isDevelopment) {
    headers.append(
      "Access-Control-Allow-Origin",
      !isDevelopment && origin ? origin : "*",
    );
  } else {
    // If the origin is not allowed and it's not in development mode, return a 403 Forbidden
    return new Response("Origin not allowed", { status: 403 });
  }

  // Optional: Uncomment if you need credentials to be included in CORS requests
  // headers.append("Access-Control-Allow-Credentials", "true");

  return new Response("OK", { status: 200, headers: headers });
};

export const omitObjectKeys = <T, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result as Omit<T, K>;
};

export const pickObjectKeys = <T, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    result[key] = obj[key];
  });
  return result;
};

interface TrackTimeConfig {
  sentryMessage: string;
  warnThreshold?: number; // Default to 1s for a warning.
  errorThreshold?: number; // Default to 5s for an error.
  extraData?: Record<string, any>; // Additional data to log.
}

export async function executeTransactionAndTrackTime<TResult>(
  operation: () => Promise<TResult>,
  config: TrackTimeConfig,
): Promise<TResult> {
  const {
    sentryMessage,
    warnThreshold = 1000,
    errorThreshold = 5000,
    extraData = {},
  } = config;
  const startTime = Date.now();

  try {
    const result = await operation();
    const endTime = Date.now();
    const duration = endTime - startTime;

    // Determine if the duration exceeds our thresholds and log accordingly.
    if (duration > errorThreshold) {
      Sentry.captureMessage(`${sentryMessage} - Error threshold exceeded`, {
        level: "error",
        extra: { ...extraData, duration },
      });
    } else if (duration > warnThreshold) {
      Sentry.captureMessage(`${sentryMessage} - Warning threshold exceeded`, {
        level: "warning",
        extra: { ...extraData, duration },
      });
    }

    return result; // Return the result of the operation.
  } catch (error) {
    // Capture the exception with Sentry and add the provided extra data.
    Sentry.captureException(error, {
      extra: { ...extraData, error },
    });
    throw error; // Rethrow the error after logging.
  }
}

export function arraysContainSameItems(arr1: any[], arr2: any[]) {
  if (arr1.length !== arr2.length) return false;
  const sortedArr1 = [...arr1].sort();
  const sortedArr2 = [...arr2].sort();
  return sortedArr1.every((value, index) => value === sortedArr2[index]);
}

export const BASE_STORAGE = 25;
export const GB_PER_USER = 3;

export const BYTES_IN_1GB = 1000000000;
export const BYTES_IN_1MB = 1000000;

/**
 * convert object keys to lowercase:
 * @example {NAME: "john"} -> {name: "john"}
 *
 * currently used in:
 * 1. importUsers client side
 */
export function mapObjectToLowercaseKeys<T extends object, K extends keyof T>(
  obj: T,
  onlyKeys?: K[],
): T {
  const entries = Object.entries(obj) as [K, T[K]][];
  const fromEntries = entries.map(([key, val]) => {
    const transformedKey =
      typeof key === "string"
        ? onlyKeys
          ? onlyKeys.includes(key)
            ? key.toLowerCase()
            : key
          : key.toLowerCase()
        : key;
    return [transformedKey, val];
  });

  return Object.fromEntries(fromEntries) as T;
}

export async function tryReadJsonFromClipboard(): Promise<object | null> {
  try {
    const text = await navigator.clipboard.readText();
    if (!text) return null;
    const json = JSON.parse(text);
    return json;
  } catch (error) {
    return null;
  }
}

export function splitIntoChunksOf<T>(array: T[], chunkSize = 10) {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }

  return chunks;
}

export const isUserOnMac = () => {
  return /Macintosh|MacIntel|MacPPC|Mac68K/i.test(window.navigator.userAgent);
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function getSubstringAfterWord(
  str: string,
  word: string,
): string | null {
  const index = str.indexOf(word);
  if (index !== -1) {
    return str.substring(index + word.length);
  }
  return null;
}
export function allEqual<T extends number | string | boolean>(
  array: T[],
): boolean {
  if (array.length === 0) return true; // Optional: Consider if an empty array should return true or false.
  return array.every((item) => item === array[0]);
}

export function scrollToBottomOfElement(elementId: string) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollTop = element.scrollHeight;
  }
}

export function round(value: number, precision: number) {
  const multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

export const getTotalStorage = ({
  isTestInstitution,
  baseStorageGb,
  gbPerUser,
  subscription,
  storageSubscription,
}: {
  isTestInstitution: boolean;
  baseStorageGb: number;
  gbPerUser: number;
  subscription: FuxamStripeSubscription | null;
  storageSubscription: FuxamStripeSubscription | null;
}) => {
  const DEMO_STORAGE_GB = 1;
  const availableStorage = isTestInstitution
    ? DEMO_STORAGE_GB + (storageSubscription?.quantity || 0) * 25
    : baseStorageGb +
      gbPerUser * (subscription?.quantity || 1) +
      (storageSubscription?.quantity || 0) * 25;
  return availableStorage;
};

export function filterUndefined<T>(value: OrNull<T> | undefined): value is T {
  return !!value;
}

export async function retry<T>(
  fn: () => Promise<T> | T,
  { retries = 5, retryIntervalMs = 1500 },
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }
    console.error({
      retriesLeft: retries - 1,
      error,
    });

    await sleep(retryIntervalMs);
    return retry(fn, { retries: retries - 1, retryIntervalMs });
  }
}

export function sleep(ms = 0) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// https://dev.to/melvin2016/how-to-check-if-a-string-contains-emojis-in-javascript-31pe#:~:text=To%20check%20if%20a%20string%20contains%20emojis%20in%20JavaScript%2C%20we,of%20Unicode%20specific%20to%20emojis.
export function isStringAnEmoji(str: string): str is string {
  const regexExp =
    /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;

  return regexExp.test(str);
}
