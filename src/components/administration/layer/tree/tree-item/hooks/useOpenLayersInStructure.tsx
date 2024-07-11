import { useEffect } from "react";
import type { Layer } from "@/src/components/administration/types";
import useDashboard from "@/src/components/dashboard/zustand";

type OpenLayersInStructureProps = {
  children: Layer[];
  openLayer: () => void;
};
/**
 * To programatically open (un-collapse)
 * all layers in the structure / hierarchy
 */
export const useOpenLayersInStructure = ({
  children,
  openLayer,
}: OpenLayersInStructureProps) => {
  const { layerPathIdsToBeOpened, setLayerPathIdsToBeOpened } = useDashboard();

  const handleOpenLayer = () => {
    openLayer();
    //remove the id of the "already opened layer" from the array
    setLayerPathIdsToBeOpened([...layerPathIdsToBeOpened].slice(1));
  };

  useEffect(() => {
    if (layerPathIdsToBeOpened.length > 0) {
      const validLayer = children.find((layer) =>
        layerPathIdsToBeOpened.includes(layer.id.toString()),
      );
      if (validLayer) {
        handleOpenLayer();
      }
    }
  }, [layerPathIdsToBeOpened]);
};
