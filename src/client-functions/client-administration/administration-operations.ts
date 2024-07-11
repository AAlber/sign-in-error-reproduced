import { track } from "@vercel/analytics";
import cuid from "cuid";
import dayjs from "dayjs";
import type { Layer } from "@/src/components/administration/types";
import useAdministration from "@/src/components/administration/zustand";
import { toast } from "@/src/components/reusable/toaster/toast";
import type { ReorderLayerPositionArgs } from "@/src/pages/api/administration/reorder-layer-position";
import api from "@/src/pages/api/api";
import { sentry } from "@/src/server/singletons/sentry";
import type { SimpleCourse } from "@/src/types/course.types";
import type {
  CreateLayerApiArgs,
  UpdateLayerTimespanArgs,
} from "@/src/types/server/administration.types";
import type {
  CourseWithDurationAndProgress,
  LayerUserHasAccessTo,
} from "@/src/types/user.types";
import { log } from "@/src/utils/logger/logger";
import useUser from "@/src/zustand/user";
import type { DndKitOperations } from "./dnd-kit-operations";
import dndKitOperations from "./dnd-kit-operations";
import type { LayerTreeOperations } from "./layer-tree-operations";
import layerTreeOperations from "./layer-tree-operations";

/** Async CRUD operations related to Administration Structure */
export class AdministrationOperations {
  constructor(
    private readonly _layerOperations: LayerTreeOperations,
    private readonly _dndOperations: DndKitOperations,
  ) {}

  /**
   * 1. Creates the new layer/course
   * 2. Rebuild the layerTree UI
   */
  async createObject(args: RemoveFrom<CreateLayerApiArgs, "id">) {
    const newLayer = this._layerOperations.generateNewLayerObject({
      id: cuid(),
      ...args,
    });

    this._layerOperations.cultivateLayerData(newLayer);
    const newLayerWithIcon = await this._uploadLayerToDatabase(newLayer);

    if (args.isCourse) {
      track("Course Created");
      this._layerOperations.cultivateLayerData(newLayerWithIcon);
    } else {
      track("Layer Created");
    }

    this.getLayerTree();
  }

  async deleteObject(idToRemove: string, optimisticUpdate = false) {
    if (optimisticUpdate) this._layerOperations.rebuildLayerTree(idToRemove);
    const response = await this._fetchHandler(api.deleteLayer, {
      method: "POST",
      body: JSON.stringify({
        layerId: idToRemove,
      }),
    });

    if (!response.ok) {
      // TODO: revert change on error if optimisticUpdate true
      toast.responseError({
        response,
        title: "Deleting the layer failed.",
      });
    }

    this.getLayerTree(); // refetch layer tree
    if (!optimisticUpdate) this._layerOperations.rebuildLayerTree(idToRemove);

    return response;
  }

  async getLayer(id: string): Promise<Layer> {
    const response = await this._fetchHandler(api.getLayer + id, {
      method: "GET",
    });
    if (!response.ok) {
      toast.responseError({
        response,
        title: "Retrieving the layer failed.",
      });
    }
    const data = await response.json();
    return data;
  }

  async getLayerTree(): Promise<Layer> {
    const { user } = useUser.getState();
    const response = await this._fetchHandler(api.getLayerTree + user.id, {
      method: "GET",
    });
    if (!response.ok) {
      sentry.captureException(response);
    }
    const data = await response.json();
    return data;
  }

  async getLayersUserHasSpecialAccessTo(
    includeLinkedCourses?: boolean,
  ): Promise<LayerUserHasAccessTo[]> {
    const url = new URL(
      api.getLayersUserHasSpecialAccessTo,
      window.location.origin,
    );

    if (typeof includeLinkedCourses === "boolean") {
      url.searchParams.append(
        "includeLinkedCourses",
        includeLinkedCourses.toString(),
      );
    }

    const response = await this._fetchHandler(url, {
      method: "GET",
    });
    if (!response.ok) {
      toast.responseError({
        response,
      });
    }

    const layers = await response.json();
    return layers.sort((a, b) => a.name.localeCompare(b.name));
  }

  async getCoursesUserHasAccessTo(): Promise<
    (SimpleCourse & { role: Role })[]
  > {
    const response = await this._fetchHandler(api.getCoursesUserHasAccessTo, {
      method: "GET",
    });
    if (!response.ok) {
      toast.responseError({
        response,
        title: "Failed to get courses",
      });
      return [];
    }
    return await response.json();
  }
  async getUserCoursesWithProgressData(): Promise<{
    courses: CourseWithDurationAndProgress[];
  } | null> {
    const response = await fetch(api.getUserCoursesWithProgressData);

    if (!response.ok) {
      toast.responseError({
        response,
        title: "Failed to get courses",
      });
      return null;
    }

    const data = await response.json();
    return data;
  }

  async getLayerPath(layerId: string) {
    const response = await this._fetchHandler(api.getLayerPath + layerId, {
      method: "GET",
    });
    if (!response.ok) {
      toast.responseError({
        response,
        title: "Failed to get layer path",
      });
      return { path: ["Error"] };
    }
    const data: {
      path: string[];
    } = await response.json();
    return data;
  }
  async getLayers(layerIds: string[]) {
    return await Promise.all(layerIds.map((id) => this.getLayer(id)));
  }

  async getLayerPathId(layerId: string) {
    const response = await this._fetchHandler(api.getLayerPathId + layerId, {
      method: "GET",
    });
    if (!response.ok) {
      toast.responseError({
        response,
        title: "Failed to get layer path (id)",
      });
      return { path: ["Error"] };
    }
    const data: {
      path: string[];
    } = await response.json();
    return data;
  }

  async getTopMostLayersUserHasAccessTo(
    userId: string,
  ): Promise<LayerUserHasAccessTo[]> {
    const response = await this._fetchHandler(
      api.getTopMostLayersUserHasAccessTo + "?userId=" + userId,
      {
        method: "GET",
      },
    );
    if (!response.ok) {
      toast.responseError({
        response,
      });
    }

    const layers = await response.json();
    return layers;
  }

  /**
   * Updates:
   * 1. the `parentId` of the layer being dragged
   * 2. position of the children of the `parentId`
   */
  async reorderLayerPosition(
    args: ReorderLayerPositionArgs,
  ): Promise<{ success: boolean }> {
    const data = await this._fetchHandler(
      api.reorderLayerAndUpdateChildrenPosition,
      {
        method: "POST",
        body: JSON.stringify(args),
      },
    );

    const result = await data.json();
    if (!data.ok) {
      const unauthorized = data.status === 401;
      const status = String(data.status).startsWith("4") ? "error" : "warning";

      toast[status](unauthorized ? "Unauthorized" : "Error", {
        description: result,
      });

      throw result;
    }

    return result as { success: boolean };
  }

  /**
   * Renames the specified layer and the course associated with it.
   */
  async renameObject(
    newName: string,
    displayName: string,
    subtitle: string,
    object: Layer,
  ) {
    const response = await this._fetchHandler(api.renameLayer, {
      method: "POST",
      body: JSON.stringify({
        id: object.id,
        name: newName,
        subtitle,
        displayName,
      }),
    });
    if (!response.ok) {
      toast.responseError({
        title: "Renaming the layer failed.",
        response: response,
      });
    }
    const { updateLayer } = useAdministration.getState();
    updateLayer({ id: object.id, name: newName });
  }

  async updateLayerTimespan(args: {
    layer: Layer;
    startTime: any;
    endTime: any;
  }) {
    const { layer, endTime, startTime } = args;

    const start =
      startTime && dayjs(startTime).isValid()
        ? dayjs(startTime).format()
        : null;

    const end =
      endTime && dayjs(endTime).isValid() ? dayjs(endTime).format() : null;

    const response = await this._fetchHandler(api.updateLayerTimespan, {
      method: "POST",
      body: JSON.stringify({
        layerId: layer.id as string,
        start,
        end,
      } satisfies UpdateLayerTimespanArgs),
    });

    if (!response.ok) {
      toast.responseError({
        title: "Updating the layer's timespan failed.",
        response,
      });

      const data = await response.json();
      throw new Error(data);
    }

    // Update UI timespan of all the children of the layer
    const { rootFlatLayer, updateLayer } = useAdministration.getState();
    if (rootFlatLayer) {
      const children = this._layerOperations.flattenTree(layer.children);
      const layersToUpdate = [layer, ...children];
      layersToUpdate.forEach((child) => {
        updateLayer({ id: child.id, start: startTime, end: endTime });
      });
    }
  }

  async getDeletedLayers(): Promise<Layer[]> {
    log.info("Getting deleted layers");
    const response = await this._fetchHandler(api.getDeletedLayers, {
      method: "GET",
    });
    if (!response.ok) {
      log.error(response, "Failed to get deleted layers");
      toast.responseError({
        response,
        title: "Failed to get deleted layers",
      });
    }
    return await response.json();
  }

  async recoverDeletedLayer(layerId: string) {
    log.info("Recovering deleted layer", layerId);
    const response = await this._fetchHandler(api.recoverDeletedLayer, {
      method: "POST",
      body: JSON.stringify({
        layerId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      log.error(response, "Failed to recover deleted layer");
      toast.responseError({
        response,
        title: "Recovering the layer failed.",
      });
    }

    this.getLayerTree();
  }

  private async _uploadLayerToDatabase(data: Layer) {
    const response = await this._fetchHandler(api.createLayer, {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      toast.responseError({
        title: "Creating the layer failed.",
        response,
      });
      return;
    }

    this.getLayerTree();
    return await response.json();
  }

  private async _fetchHandler(...args: Parameters<typeof fetch>) {
    useAdministration.setState({ isDraggingDisabled: true });
    const response = await fetch(...args);
    useAdministration.setState({ isDraggingDisabled: false });
    return response;
  }
}

const administrationOperations = new AdministrationOperations(
  layerTreeOperations,
  dndKitOperations,
);

export default administrationOperations;
