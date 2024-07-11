import type { _Object } from "@aws-sdk/client-s3";
import { getKeyFromUrl } from "@/src/client-functions/client-cloudflare/utils";
import type {
  DeleteMultipleDirectoriesData,
  ReducedR2Object,
} from "@/src/types/storage.types";
import { filterUndefined } from "@/src/utils/utils";

export function getValueAfterSegment({
  url,
  segment,
}: SegmentSplittingAttributes) {
  const parts = url.split("/");
  const indices = parts.reduce((acc: any[], part, index) => {
    if (part === segment) {
      acc.push(index);
    }
    return acc;
  }, []);

  if (indices.length > 1) {
    throw new Error(`Multiple segments named '${segment}' found.`);
  }

  const index = indices.length === 1 ? indices[0] : -1;

  if (index === -1 || index === parts.length - 1) {
    return null; // segment not found, or it's the last part of the URL
  }

  return parts[index! + 1];
}

export type SegmentSplittingAttributes = {
  url: string;
  segment: PathSegmentations;
};

export function replaceValueAfterSegment({ url, segment, newValue }) {
  const parts = url.split("/");
  const index = parts.indexOf(segment);

  if (index === -1 || index >= parts.length - 1) {
    return url; // segment not found, or it's the last part of the URL
  }

  parts[index + 1] = newValue; // Replace the value after the segment
  return parts.join("/"); // Reconstruct the URL
}

export function extractSubpath({
  url,
  segment,
}: {
  url: string;
  segment: PathSegmentations;
}): string | undefined {
  // Split the URL by '/' to get the components
  const parts = url.split("/");
  // Find the index of the part that contains the marker
  const markerIndex = parts.indexOf(segment);

  if (markerIndex === -1) {
    // If the marker is not found, return an empty string
    return "";
  }

  // Extract the subpath components after the marker and before the last component (file name)
  const subpathParts = parts.slice(markerIndex + 1, -1);

  // Join the subpath components back with '/'
  return subpathParts.length === 0 ? undefined : subpathParts.join("/");
}

export type PathSegmentations =
  | "institutions"
  | "block"
  | "layer"
  | "handIn"
  | "user-drive"
  | "user-documents"
  | "workbench"
  | "logos"
  | "public"
  | "course-drive"
  | "user";

export function getSecondValueAfterSegment({
  url,
  segment,
}: SegmentSplittingAttributes) {
  const parts = url.split("/");
  const index = parts.indexOf(segment);

  if (index === -1 || index >= parts.length - 2) {
    return null; // segment not found, or there aren't enough segments after it
  }

  return parts[index + 2];
}

export const filterOutFirebaseFiles = (data: DeleteMultipleDirectoriesData) => {
  return data.filter(({ url }) => !url.includes("firebase"));
};

export const decodeAndGetKey = (url: string) => {
  return decodeURIComponent(getKeyFromUrl(url));
};

export const getSizeFromObjects = (
  objects: _Object[],
  key?: string,
): number => {
  if (key) {
    return objects
      .filter((obj) => obj.Key?.includes(key))
      .reduce((acc: number, curr: _Object) => acc + (curr.Size || 0), 0);
  }
  return objects.reduce(
    (acc: number, curr: _Object) => acc + (curr.Size || 0),
    0,
  );
};

interface LayerData {
  layerId: string | null | undefined;
  size: number;
}
export function aggregateSizes(data: LayerData[]): LayerData[] {
  const resultMap = data.reduce((acc, { layerId, size }) => {
    if (!layerId) return acc;
    if (acc.has(layerId)) {
      acc.set(layerId, acc.get(layerId)! + size);
    } else {
      acc.set(layerId, size);
    }
    return acc;
  }, new Map<string, number>());

  // Convert the Map back into an array of LayerData objects
  return Array.from(resultMap, ([layerId, size]) => ({ layerId, size }));
}

export const convertCloudflareObjectToReducedObject = (
  objects?: _Object[],
): ReducedR2Object[] => {
  if (!objects) return [];
  const finalObjects = (objects as _Object[])
    .map((obj: _Object) => {
      const { Key, Size, LastModified } = obj;
      if (!Key || !Size || !LastModified) return;
      const data: ReducedR2Object = {
        Key,
        Size,
        LastModified,
      };
      return data;
    })
    .filter(filterUndefined) satisfies ReducedR2Object[];
  return finalObjects;
};

export const defaultStorageCategories = [
  {
    title: "course-drive",
    size: 0,
  },
  {
    title: "content_block_files",
    size: 0,
  },
];
