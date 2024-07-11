import dynamic from "next/dynamic";
import { useEffect } from "react";
import structureHandler from "@/src/client-functions/client-administration/structure-handler";
import { deepCopy } from "@/src/client-functions/client-utils";
import { useAsyncData } from "@/src/client-functions/client-utils/hooks";
import useUser from "@/src/zustand/user";
import Skeleton from "../skeleton";
import LayerTree from "./layer/tree";
import NoLayers from "./no-layers";
import useAdministration from "./zustand";

const LayerSettings = dynamic(() => import("../popups/layer-settings"));

const AdministrationTree = () => {
  const { data: layerTree, loading } = useAsyncData(() =>
    structureHandler.get.layerTree(),
  );

  const institutionId = useUser((state) => state.user.currentInstitutionId);
  const layerTree_ = useAdministration((state) => state.layerTree_);
  const noLayers = !layerTree_?.length;

  useEffect(() => {
    if (!layerTree) return;
    const { rootFlatLayer, currentLayer } = useAdministration.getState();

    // flatten the tree returned by api
    let rootFlatTreeFromApi = structureHandler.utils.layerTree.flattenTree(
      layerTree.children,
    );

    // sync collapsed/expanded state from persisted rootTree
    rootFlatTreeFromApi = rootFlatTreeFromApi.map((layer) => ({
      ...layer,
      collapsed: !!rootFlatLayer?.find((i) => i.id === layer.id)?.collapsed,
    }));

    let clonedFlatTree = deepCopy(rootFlatTreeFromApi);

    if (layerTree_) {
      const treeFromState = clonedFlatTree.find((i) => i.id === currentLayer);

      if (treeFromState?.children) {
        clonedFlatTree = structureHandler.utils.layerTree.flattenTree(
          treeFromState.children,
        );
      }
    }

    // build tree from the currently selected layer `currentLayer`
    const tree = structureHandler.utils.layerTree.buildTree(clonedFlatTree);

    useAdministration.setState({
      layerTree_: tree,
      rootFlatLayer: rootFlatTreeFromApi,
      currentLayer: currentLayer || institutionId,
    });
  }, [layerTree]);

  return (
    <div className="z-40 flex h-full flex-col p-4">
      <LayerSettings />
      <div
        className={
          "flex size-full flex-1 flex-col divide-y divide-border overflow-y-scroll rounded-lg border border-border bg-foreground"
        }
      >
        <div className="h-full min-w-full divide-y divide-border align-middle">
          {noLayers && !loading && <NoLayers />}
          {loading && (
            <div className="h-full">
              <Skeleton />
            </div>
          )}
          {!loading && <LayerTree />}
        </div>
      </div>
    </div>
  );
};

export default AdministrationTree;
