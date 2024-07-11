import type { AuthData, UploadPathType } from "@/src/types/storage.types";
import {
  extractSubpath,
  getSecondValueAfterSegment,
  getValueAfterSegment,
} from "./utils";

export function extractDataFromUrl(
  url: string,
  type: UploadPathType,
): AuthData {
  const institutionId = getValueAfterSegment({ url, segment: "institutions" });
  switch (type) {
    // TODO: Need to handle user Storage properly
    case "logo":
      return { type };
    case "user-drive":
      return {
        type,
        userId: getValueAfterSegment({ url, segment: "user" }),
        subPath: extractSubpath({ url, segment: "user-drive" }),
        institutionId,
      };
    case "user-documents":
      return {
        type,
        userId: getValueAfterSegment({ url, segment: "user" }),
        subPath: extractSubpath({ url, segment: "user-documents" }),
        institutionId,
      };
    case "handIn":
      return {
        type,
        layerId: getValueAfterSegment({ url, segment: "layer" }),
        blockId: getValueAfterSegment({ url, segment: "handIn" }),
        userId: getSecondValueAfterSegment({ url, segment: "handIn" }),
        institutionId,
      };
    case "course-drive": {
      return {
        type,
        layerId: getValueAfterSegment({ url, segment: "layer" }),
        subPath: extractSubpath({ url, segment: "course-drive" }),
        institutionId,
      };
    }
    case "block":
      return {
        type,
        layerId: getValueAfterSegment({ url, segment: "layer" }),
        blockId: getValueAfterSegment({ url, segment: "block" }),
      };
    case "workbench":
      return {
        type,
        layerId: getValueAfterSegment({ url, segment: "layer" }),
        blockId: getValueAfterSegment({ url, segment: "workbench" }),
        elementId: getSecondValueAfterSegment({ url, segment: "workbench" }),
        institutionId,
      };
    case "layer":
      return {
        type,
        layerId: getValueAfterSegment({ url, segment: "layer" }),
        institutionId,
      };
    case "institution":
      return {
        type,
        institutionId: getValueAfterSegment({ url, segment: "institutions" }),
      };
    case "public":
      return {
        type,
        subPath: extractSubpath({ url, segment: "public" }),
      };
    case undefined:
      return { type };
  }
}

export const getUploadTypeBasedOnKey = (key: string): UploadPathType => {
  const emptyString1 = key.startsWith("/") ? 1 : 0;
  const splitkey = key.split("/");
  if (splitkey[0 + emptyString1] === "logos") {
    return "logo";
  } else if (splitkey[0 + emptyString1] === "public") {
    return "public";
  } else if (splitkey[4 + emptyString1] === "user-drive") {
    return "user-drive";
  } else if (splitkey[4 + emptyString1] === "user-documents") {
    return "user-documents";
  } else if (splitkey[4 + emptyString1] === "block") {
    return "block";
  } else if (splitkey[4 + emptyString1] === "handIn") {
    return "handIn";
  } else if (splitkey[4 + emptyString1] === "course-drive") {
    return "course-drive";
  } else if (splitkey[4 + emptyString1] === "workbench") {
    return "workbench";
  } else if (
    splitkey[0 + emptyString1] === "institutions" &&
    splitkey[2 + emptyString1] === "layer"
  ) {
    return "layer";
  } else if (splitkey[0 + emptyString1] === "institutions") {
    return "institution";
  } else return undefined;
};
