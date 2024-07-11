import { useEffect } from "react";
import structureHandler from "@/src/client-functions/client-administration/structure-handler";
import { useAsyncData } from "@/src/client-functions/client-utils/hooks";
import useDashboard from "../../../dashboard/zustand";

export const useShowInStructure = (layerId: string) => {
  const { data, loading, error } = useAsyncData(
    () => structureHandler.get.layerPathId(layerId),
    JSON.stringify(layerId),
  );

  const { setLayerPathIdsToBeOpened } = useDashboard();

  useEffect(() => {
    if (data) {
      setLayerPathIdsToBeOpened(data.path);
    }
  }, [data]);

  return { data, loading, error };
};
