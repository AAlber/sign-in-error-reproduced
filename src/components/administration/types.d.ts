import type { UniqueIdentifier } from "@dnd-kit/core";
import type { MutableRefObject } from "react";
import type { CourseDataWithLayerData } from "@/src/types/course.types";

export interface TreeItem extends Partial<Layer> {
  id: UniqueIdentifier | string;
  children: TreeItem[];
  collapsed?: boolean;
}

export type TreeItems = TreeItem[];

export interface FlattenedItem extends TreeItem {
  /** the `parentId` used by DND kit */
  parentId: UniqueIdentifier | null;
  depth: number;
  index: number;
}

export type SensorContext = MutableRefObject<{
  items: FlattenedItem[];
  offset: number;
}>;

export type Layer = {
  children: Layer[];
  course?: CourseDataWithLayerData;
  id: UniqueIdentifier;
  institution_id: string;
  isCourse: boolean;
  /** the `parentId` coming from db */
  parent_id?: string;
  moderators?: any[];
  name: string;
  position?: number;
  storageUsage?: number;
  /** Start Date in string format */
  start?: string;
  /** End Date in string format */
  end?: string;
  isLinkedCourse?: boolean;
  linkedCourseLayerId?: string;
  deletedAt?: string;
};

export interface Administration {
  currentLayer: string;
  isAddingCourse: boolean;
  layerTree_: TreeItems | undefined;
  /** the original flattened tree */
  rootFlatLayer: FlattenedItem[] | undefined;
  /**
   * the string value when searching/filtering a layer,
   * we'll need this to disable dragging later on when there is filtered layer
   * */
  filter: string;
  isDraggingDisabled: boolean;
}

type AdministrationMethod<T> = (data: T) => void;
export interface AdministrationMethods {
  /**
   * we use this along with `setLayerTree_` to determine the child layers to show,
   * example: if institutionId is `currentLayer` then show the entire tree
   * (build the tree based on the children of `currentLayer`)
   * */
  setCurrentLayer: AdministrationMethod<string>;
  /** Used when searching for a layer */
  setFilter: AdministrationMethod<string>;
  /** Used along with `setCurrentLayer` to build the tree UI based on children of `currentLayer` */
  setLayerTree_: AdministrationMethod<TreeItems>;
  /**
   * Basically all the layers of the root tree flattened to 1 depth.
   *
   * Steps to build the layerTree is:
   * - select a currentLayer from the rootFlatLayer
   * - build the tree based on children of selected `currentLayer`
   * - use `setLayerTree_` to set the tree UI
   */
  setRootFlatLayer: AdministrationMethod<Administration["rootFlatLayer"]>;
  updateLayer: AdministrationMethod<Partial<Layer> & { id: UniqueIdentifier }>;
  /** Checks if layerId is a child of (or is related to) parentId */
  isLayerAChildOf: (layerId: string, parentId: string) => boolean;
  reset: () => void;
}
