import clsx from "clsx";
import { ChevronDownIcon } from "lucide-react";
import React from "react";
import structureHandler from "@/src/client-functions/client-administration/structure-handler";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import type { Layer } from "../../../types";
import useAdministration from "../../../zustand";
import LayerOptions from "../../layer-options";
import type { TreeItemProps } from ".";
import ContextMenu from "./context-menu";
import { useOpenLayersInStructure } from "./hooks/useOpenLayersInStructure";
import LayerIcons from "./icons";
import TimeSpan from "./time-span";
import styles from "./tree-item.module.scss";

const LayerComponent: React.FC<TreeItemProps> = (props) => {
  const { clone, collapsed, layer } = props;
  const childCount = layer.children.length;
  const hasTimeSpan = !!layer.start || !!layer.end;

  useOpenLayersInStructure({
    children: props.layer.children,
    openLayer: () => handleCollapse_(true),
  });

  const handleCollapse_ = (forceOpen = false) => {
    if (!forceOpen || (forceOpen && collapsed)) {
      structureHandler.utils.layerTree.handleCollapse(layer.id);
    }
  };

  return (
    <>
      {clone ? (
        <>
          <LayerItemsMemo
            childCount={childCount}
            hasTimeSpan={hasTimeSpan}
            layer={layer}
          />
          {!!childCount && <span className={styles.Count}>{childCount}</span>}
        </>
      ) : (
        <>
          {childCount > 0 && (
            <Button
              className={clsx(!childCount && "hover:bg-transparent")}
              size={"icon"}
              variant={"ghost"}
              onClick={() => handleCollapse_()}
            >
              <ChevronDownIcon
                size={18}
                className={clsx(
                  "text-muted-contrast transition-transform duration-200",
                  collapsed && "-rotate-90",
                  !childCount && "hidden",
                )}
              />
            </Button>
          )}

          <LayerItemsMemo
            childCount={childCount}
            hasTimeSpan={hasTimeSpan}
            layer={layer}
          />
          <LayerOptions layer={layer} />
        </>
      )}
    </>
  );
};

export default React.memo(LayerComponent);

const LayerItems = (props: {
  childCount: number;
  hasTimeSpan: boolean;
  layer: Layer;
}) => {
  const { childCount, hasTimeSpan, layer } = props;
  const { layerTree_ } = useAdministration();

  const parent = structureHandler.utils.layerTree
    .flattenTree(layerTree_ || [])
    .find((i) => i.id === layer.parent_id);

  const hasParentTimeSpan = parent && (!!parent?.start || !!parent?.end);

  return (
    <>
      <LayerIcons
        hasChildren={!!childCount}
        hasTimeSpan={hasTimeSpan && !hasParentTimeSpan}
      />
      <span className="block text-sm text-contrast">{layer.name}</span>
      <ContextMenu layer={layer} />
      <TimeSpan layer={layer} />

      <span className="grow">{/* placeholder*/}</span>
    </>
  );
};

const LayerItemsMemo = React.memo(LayerItems);
