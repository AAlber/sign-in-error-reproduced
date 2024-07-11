import { produce } from "immer";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import structureHandler from "@/src/client-functions/client-administration/structure-handler";
import type { Administration, AdministrationMethods, Layer } from "./types";

const initialState: Administration = {
  currentLayer: "",
  isAddingCourse: false,
  layerTree_: undefined,
  rootFlatLayer: undefined,
  filter: "",
  isDraggingDisabled: false,
};

const useAdministration = create<Administration & AdministrationMethods>()(
  persist(
    (set, get) => ({
      ...initialState,
      isLayerAChildOf: (layerId, parentId) => {
        const flatTree = get().rootFlatLayer;
        if (!flatTree) return false;

        const path = structureHandler.utils.layerTree.getHierarchyPath(
          layerId,
          flatTree,
        );

        return path.map(({ id }) => id).includes(parentId);
      },
      reset: () => set(initialState),
      setCurrentLayer: (data) => set(() => ({ currentLayer: data })),
      setFilter: (data) => set(() => ({ filter: data })),
      setLayerToAdd: (data, course) =>
        set(() => ({ layerToAdd: data, isAddingCourse: course })),
      setLayerTree_: (data) => set(() => ({ layerTree_: data })),
      setRootFlatLayer: (data) => set(() => ({ rootFlatLayer: data })),
      updateLayer: (data) =>
        set((state) =>
          produce(state, (draft) => {
            const rootFlatLayer = draft.rootFlatLayer;
            const layerTree = draft.layerTree_;
            if (!rootFlatLayer || !layerTree) return;

            const layerIdx = rootFlatLayer.findIndex((i) => i.id === data.id);
            const layerToUpdate = rootFlatLayer[layerIdx];
            if (layerIdx > -1 && layerToUpdate) {
              const keys = Object.keys(data) as (keyof Layer)[];

              keys.forEach((key) => {
                (layerToUpdate as any)[key] = data[key];
              });

              const layer = structureHandler.utils.dndKit.findItemDeep(
                layerTree,
                data.id,
              );

              if (layer) {
                keys.forEach((key) => {
                  (layer as any)[key] = data[key];
                });
              }
            }
          }),
        ),
    }),
    {
      name: "administration",
      version: 1,
    },
  ),
);

export default useAdministration;

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("useAdministration", useAdministration);
}
