import { type ClassValue, clsx } from "clsx";
import { utcToZonedTime } from "date-fns-tz";
import type { TFunction } from "i18next";
import mime from "mime";
import type { NextRouter } from "next/router";
import psl from "psl";
import { twMerge } from "tailwind-merge";
import useFileViewerSheet from "@/src/components/popups/file-viewer-sheet/zustand";
import { toast } from "@/src/components/reusable/toaster/toast";
import { supportedFileTypesForFileViewer } from "@/src/utils/utils";
import useUser from "@/src/zustand/user";
import { proxyCloudflareReadRequest } from "../client-cloudflare/utils";
import confirmAction from "../client-options-modal";

export default function classNames(...classes: ClassValue[]) {
  return twMerge(clsx(classes));
}

export const turnToLowerCamelCase = (str: string) => {
  return firstCharToLowerCase(removeWhiteSpace(str));
};

export function filterUndefinedInArray<T>(items: (T | undefined)[]): T[] {
  if (!items) return [];
  return items.filter((item): item is T => item !== undefined);
}

export const removeWhiteSpace = (text: string) => {
  return text.replace(/\s+/g, "");
};
export const promisList = async (asyncFunctions: Array<() => Promise<any>>) => {
  const promises: Promise<any>[] = [];
  for (const asyncFunction of asyncFunctions) {
    promises.push(asyncFunction());
  }
  return await Promise.all(promises);
};

export function firstCharToLowerCase(inputString: string): string {
  if (inputString.length === 0) {
    return inputString; // If the string is empty, return as is
  }

  return inputString.charAt(0).toLowerCase() + inputString.slice(1);
}

export function isString(value: any): value is string {
  return typeof value === "string";
}

export function removeUndefinedAndNullItems(array) {
  // Use the filter() method to create a new array with non-null and non-undefined items.
  if (!array || array.length === 0) return [];
  return array.filter((item) => item !== undefined && item !== null);
}

export function getEnumValue(
  enumObj: object,
  targetString: string,
): string | null {
  const keys = Object.keys(enumObj) as (keyof typeof enumObj)[];
  const matchingKey = keys.find((key) =>
    (key as string).includes(removeWhiteSpace(targetString)),
  );

  return matchingKey ? enumObj[matchingKey] : null;
}

export function isEmptyObject(obj: Record<string, any>): boolean {
  return Object.keys(obj).length === 0;
}

export function capitalizeFirstLetter(value?: string | null) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function daysUntil(unixTimestamp: number): number {
  // Convert the Unix timestamp to a Date object
  const targetDate = new Date(unixTimestamp * 1000);

  // Get the current date
  const currentDate = new Date();

  // Calculate the difference in time (in milliseconds)
  const diffInTime = targetDate.getTime() - currentDate.getTime();

  // Convert the time difference from milliseconds to days
  const diffInDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24));

  return diffInDays;
}

export function moveItemToBeginning(arr: any[], selectedItemId: string): any[] {
  const selectedIdx = arr.findIndex((item) => item.id === selectedItemId);

  if (selectedIdx === -1) {
    // Item with the given ID not found
    return arr;
  }

  const selectedItem = arr[selectedIdx];

  // Remove the selected item from its original position
  arr.splice(selectedIdx, 1);

  // Add the selected item at the beginning of the array
  arr.unshift(selectedItem!);
  return arr;
}

export async function createFile(
  url: string,
  fileName: string,
  type: string | undefined,
) {
  const response = await fetch(url);
  const data = await response.blob();
  const fileType = type ? type : data.type;
  const metadata = { type: fileType };
  return new File([data], fileName, metadata);
}

export function getEnumKeys(enumObject: object): string[] {
  return Object.keys(enumObject).filter((key) => isNaN(Number(key)));
}

export function getKeyByValue(object1: any, object2: any, value: any) {
  return (
    Object.keys(object1).find((key) => object1[key] === value) ||
    Object.keys(object2).find((key) => object2[key] === value)
  );
}

export const copyToClipBoard = async (text: string) => {
  if ("clipboard" in navigator) {
    return await navigator.clipboard.writeText(text);
  } else {
    return document.execCommand("copy", true, text);
  }
};

export const removeQueryParam = (
  router: NextRouter,
  param?: string | string[],
) => {
  // Use destructuring to get the current pathname and query object
  const { pathname, query } = router;

  if (Array.isArray(param)) {
    for (const p of param) {
      delete query[p];
    }
  } else {
    delete query[param || "state"];
  }
  // Remove the query parameter

  // Replace the current URL with the same pathname, but updated query params
  router.replace(
    {
      pathname,
      query,
    },
    undefined,
    { scroll: false },
  ); // This will not trigger a scroll
};

export function downloadFile(filename, blob) {
  // Create a link and set the URL using the Blob
  const link = document.createElement("a");
  link.download = filename;
  link.href = URL.createObjectURL(blob);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // Cleanup the URL object
  setTimeout(() => URL.revokeObjectURL(link.href), 100);
}

export async function downloadFileFromUrl(
  filename: string,
  dataUrl: string,
  openIfSupported = false,
  secureMode = false,
) {
  // Construct the 'a' element
  const url = await proxyCloudflareReadRequest(dataUrl);
  if (url === "") return;
  await fetch(url)
    .then(async (res) => res.blob())
    .then(async (blob) => {
      if (!blob) return;
      // Check the file type

      const finalType = blob.type === "" ? mime.getType(dataUrl) : blob.type;
      if (
        supportedFileTypesForFileViewer.includes(finalType!) &&
        openIfSupported
      ) {
        const { initSheet } = useFileViewerSheet.getState();
        initSheet({
          fileUrl: url,
          fileName: decodeURIComponent(filename),
          secureMode,
        });
        return;
      } else {
        // Handle other file types
        downloadFile(filename, blob);
      }
    })
    .catch((error) => console.error("Error fetching the Blob:", error));
}

export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function capitalizeEveryWordFromString(value: string) {
  const arr = value.split(" ");
  return arr.reduce((p, c, idx) => {
    return idx === 0
      ? capitalize(c)
      : `${p} ${c.toLowerCase() === "and" ? c.toLowerCase() : capitalize(c)}`;
  }, "");
}

export function checkIfValidEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

export function isUrl(str: string) {
  if (typeof str !== "string") {
    return false;
  }

  let url: URL;
  try {
    url = new URL(normalizeLink(str));
  } catch (e) {
    return false;
  }

  // check if TLD is valid
  if (!psl.isValid(url.hostname)) return false;
  return true;
}

export function normalizeLink(link: string) {
  const idx = link.indexOf("://");
  const str = link.substring(idx === -1 ? 0 : idx + 3);
  return `https://${str}`;
}

export function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Returns a regex of the message formatting,
 * currently used to add `&nbsp` to the message to handle
 * moderation
 *
 * @returns Regex - $1 is the opening html bracket, $2 is the main message,
 * $3 is the closing html bracket
 */
export function getHtmlFormattingRegex(html: string) {
  const possibleTextFormattingHtml = [
    /^(<p><s><u><em><strong>)([\s\S]*)(<\/strong><\/em><\/u><\s><\/p>)$/,
    /^(<p><s><u><em>)([\s\S]*)(<\/em><\/u><\s><\/p>)$/,
    /^(<p><s><u><strong>)([\s\S]*)(<\/strong><\/u><\s><\/p>)$/,
    /^(<p><s><strong>)([\s\S]*)(<\/strong><\/s><\/p>)$/,
    /^(<p><s><em><strong>)([\s\S]*)(<\/strong><\/em><\s><\/p>)$/,
    /^(<p><s><em>)([\s\S]*)(<\/em><\/s><\/p>)$/,
    /^(<p><s>)([\s\S]*)(<\/s><\/p>)$/,
    /^(<p><u><em><strong>)([\s\S]*)(<\/strong><\/em><\/u><\/p>)$/,
    /^(<p><u><em>)([\s\S]*)(<\/em><\/u><\/p>)$/,
    /^(<p><u>)([\s\S]*)(<\/u><\/p>)$/,
    /^(<p><strong>)([\s\S]*)(<\/strong><\/p>)$/,
    /^(<p><em><strong>)([\s\S]*)(<\/strong><\/em><\/p>)$/,
    /^(<p><em>)([\s\S]*)(<\/em><\/p>)$/,
    /^(<p>)([\s\S]*)(<\/p>)$/,
  ];

  return possibleTextFormattingHtml.find((i) => i.test(html));
}
export function getLastItem<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}

export const bgColor = (color: string) =>
  color === "red"
    ? "bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200"
    : color === "yellow"
    ? "bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200"
    : color === "emerald"
    ? "bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200"
    : color === "blue"
    ? "bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200"
    : color === "indigo"
    ? "bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200"
    : color === "orange"
    ? "bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200"
    : "bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200";

export function formatDurationMillisToHour(milliseconds: number): string {
  const hours = milliseconds / 1000 / 60 / 60;
  return `${hours.toFixed(1)}H`;
}
export function roundUpToNearestTen(num: number): number {
  return Math.ceil(num / 10) * 10;
}

export function truncate(str: string, length: number) {
  return str.length > length ? str.substring(0, length - 3) + "..." : str;
}
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const toastComingSoon = () => {
  const icon = ["🏗️", "🚧", "👷"];
  const randomIcon = icon[Math.floor(Math.random() * icon.length)];
  return toast.warning("toast.content_block_warning_in_development", {
    icon: randomIcon,
    description: "toast.content_block_warning_in_development_description",
  });
};

export const toastNotEnoughAICredits = () => {
  return toast.warning("not_enough_credits", {
    icon: "🤚",
    description: "not_enough_credits_description",
  });
};

export const formatNumber = (number: number) => {
  const formattedNumber = Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(number);

  return formattedNumber;
};

export function replaceVariablesInString(
  text: string,
  variables: (string | number | undefined)[],
): string {
  const parts = text.split(/(\{[0-9]+\})/);
  return parts
    .map((part) => {
      const targetIndexMatch = part.match(/\{([0-9]+)\}/);
      if (targetIndexMatch) {
        const targetIndex = parseInt(targetIndexMatch[1]!, 10) - 1;
        const target = variables[targetIndex];
        return target;
      }
      return part;
    })
    .join("");
}

/**
 * Currently used in chat notification, used to decode innerText html entities to its literal value
 * https://stackoverflow.com/questions/44195322/a-plain-javascript-way-to-decode-html-entities-works-on-both-browsers-and-node
 * */

export function decodeHtmlEntities(encodedString: string) {
  const translate_re = /&(nbsp|amp|quot|lt|gt);/g;
  const translate = {
    nbsp: " ",
    amp: "&",
    quot: '"',
    // lt: "<",
    // gt: ">",
  };
  return encodedString
    .replace(translate_re, function (match, entity) {
      return translate[entity];
    })
    .replace(/&#(\d+);/gi, function (match, numStr) {
      const num = parseInt(numStr, 10);
      return String.fromCharCode(num);
    });
}

export function convertTimeToUserTimezone(dateTime: string | Date) {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return utcToZonedTime(dateTime, userTimeZone);
}

export function convertToEmbedLink(originalLink: string): string {
  const embedLink = originalLink.replace(/(\?|&)sid=[^&]*/g, "");
  const finalEmbedLink = embedLink.replace("/share/", "/embed/");

  return finalEmbedLink;
}

/* Functions to the emoji picker */

export const categorizeEmojis = (emojis, typedData) => {
  const categories = typedData.categories.reduce((acc, category) => {
    acc[category.id] = [];
    return acc;
  }, {});

  emojis.forEach((emoji) => {
    const category = typedData.categories.find((c) =>
      c.emojis.includes(emoji.id),
    );
    if (category) {
      categories[category.id].push(emoji.skins[0].native);
    }
  });

  return categories;
};

/**
 * If the organisation has a statement of independence required, show a confirmation modal
 * before the action is executed, otherwise execute the action
 * @param action
 */
export async function requireStatementOfIndependenceIfEnabledOrProceed(
  action: () => void | Promise<any>,
) {
  const { user } = useUser.getState();

  if (
    user.institution?.institutionSettings.statement_of_independence_required
  ) {
    confirmAction(action, {
      title: "statement_of_independence",
      description: "statement_of_independence_description",
      actionName: "general.confirm",
    });
  } else {
    await action();
  }
}

export function removeDuplicates<T>(arr: T[]): T[] {
  const seen = new Set<T>();
  const result: T[] = [];
  for (const item of arr) {
    if (!seen.has(item)) {
      seen.add(item);
      result.push(item);
    }
  }
  return result;
}

export function throttle(func: (...args: any[]) => void, limit: number) {
  let lastFunc: NodeJS.Timeout;
  let lastRan: number;
  return function (...args: any[]) {
    if (!lastRan) {
      func(...args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(
        () => {
          if (Date.now() - lastRan >= limit) {
            func(...args);
            lastRan = Date.now();
          }
        },
        limit - (Date.now() - lastRan),
      );
    }
  };
}

export const onNumberInputChange = ({
  value,
  setValue,
  max,
  min,
  maxValueExceededAction,
  belowMinValueAction,
  t,
}: {
  value: number | undefined;
  setValue: (value: number | undefined) => void;
  min: number;
  max: number;
  maxValueExceededAction?: (
    val: number,
    t: TFunction<"page", undefined>,
  ) => void;
  belowMinValueAction?: (val: number, t: TFunction<"page", undefined>) => void;
  t: TFunction<"page", undefined>;
}) => {
  const maxValAction = maxValueExceededAction ?? toastValueTooHigh;
  const minValAction = belowMinValueAction ?? toastValueTooLow;
  if (value === undefined) {
    // Do nothing, allow the field to be empty
  } else if ((!value && value !== 0) || isNaN(value) || Number(value) < 0) {
    setValue(undefined);
  } else if (Number(value) < min) {
    minValAction(min, t); // Prompt user to enter a valid amount
  } else if (Number(value) > max) {
    maxValAction(max, t); // Notify user about special offers for large amounts
  } else {
    setValue(value); // Valid amount, set the user amount
  }
};

export const toastValueTooLow = (
  min: number,
  t: TFunction<"page", undefined>,
) => {
  toast.warning("value_too_low", {
    description: replaceVariablesInString(t("value_too_low_description"), [
      min,
    ]),
  });
};

export const toastValueTooHigh = (
  max: number,
  t: TFunction<"page", undefined>,
) => {
  toast.warning("value_too_high", {
    description: replaceVariablesInString(t("value_too_high_description"), [
      max,
    ]),
  });
};
