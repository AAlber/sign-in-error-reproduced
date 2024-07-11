// Import statements or other necessary imports for your project
import type {
  ReducedR2Object,
  StorageCategory,
} from "@/src/types/storage.types";

// Define a common interface for comparison items
interface ComparisonItem {
  identifier: string;
  size: number;
  lastModified?: Date;
}

// Type for extracting string identifier from a type
type Identifier<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

// Adapt a type to match the ComparisonItem interface
type AdaptToComparisonItem<T> = T extends { [id in Identifier<T>]: infer R }
  ? R & {
      size: number;
      lastModified?: Date;
    }
  : never;

// Type for comparison results
type ComparisonResult<T> = {
  matchingObjects: T[];
  mismatchingObjectsFirst: T[];
  mismatchingObjectsSecond: T[];
};

// Generic function to compare two arrays of items
function compareArrays<T, U extends AdaptToComparisonItem<T>>(
  arr1: T[] | undefined,
  arr2: T[] | undefined,
  getId: (item: T) => string,
  isEqual: (item1: U, item2: U) => boolean,
  isSimilar: (item1: U, item2: U) => boolean = isEqual,
): ComparisonResult<U> {
  const matchingObjects: U[] = [];
  const mismatchingObjectsFirst: U[] = [];
  const mismatchingObjectsSecond: U[] = [];

  const map2 = new Map<string, U>(
    (arr2 || []).map((item) => [getId(item), item as unknown as U]),
  );

  (arr1 || []).forEach((item1) => {
    const item2 = map2.get(getId(item1));
    if (item2) {
      if (isEqual(item1 as unknown as U, item2)) {
        matchingObjects.push(item1 as unknown as U);
      } else if (isSimilar(item1 as unknown as U, item2)) {
        mismatchingObjectsFirst.push(item1 as unknown as U);
      }
      map2.delete(getId(item1));
    } else {
      mismatchingObjectsFirst.push(item1 as unknown as U);
    }
  });

  map2.forEach((item) => mismatchingObjectsSecond.push(item));

  return {
    matchingObjects,
    mismatchingObjectsFirst,
    mismatchingObjectsSecond,
  };
}

// Example specific implementations of the compareArrays function for different item types
export function compareReducedR2Objects(
  arr1: ReducedR2Object[],
  arr2: ReducedR2Object[],
) {
  return compareArrays(
    arr1,
    arr2,
    (item) => item.Key, // Use the 'Key' property as the identifier
    (item1, item2) =>
      item1.size === item2.size &&
      item1.lastModified?.getTime() === item2.lastModified?.getTime(),
    (item1, item2) =>
      Math.abs(
        (item1.lastModified?.getTime() || 0) -
          (item2.lastModified?.getTime() || 0),
      ) <= 600000,
  );
}

// Additional functions can be added here following the same pattern
type LayerItem = {
  layerId: string | null | undefined;
  size: number;
};

export function compareLayerSizes(arr1?: LayerItem[], arr2?: LayerItem[]) {
  return compareArrays(
    arr1 || [],
    arr2 || [],
    (item) => item.layerId as string, // Assuming 'layerId' is the string identifier
    (item1, item2) => item1.size === item2.size,
  );
}

export function compareStorageCategories(
  arr1: StorageCategory[],
  arr2: StorageCategory[],
) {
  return compareArrays(
    arr1,
    arr2,
    (item) => item.title, // Use 'title' as the identifier
    (item1, item2) => item1.size === item2.size,
  );
}
