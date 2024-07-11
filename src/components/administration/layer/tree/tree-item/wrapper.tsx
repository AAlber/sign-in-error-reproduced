import clsx from "clsx";
import React, {
  forwardRef,
  type PropsWithChildren,
  useRef,
  useState,
} from "react";
import structureHandler from "@/src/client-functions/client-administration/structure-handler";
import useAdministration from "@/src/components/administration/zustand";
import useUserLayerManagement from "@/src/components/popups/layer-user-management/zustand";
import { type TreeItemProps } from ".";
import Handle from "./handle";
import { useShowCourseInStructure } from "./hooks/useShowCourseInStructure";
import styles from "./tree-item.module.scss";

const Wrapper = forwardRef<HTMLDivElement, PropsWithChildren<TreeItemProps>>(
  (props, ref) => {
    const [active, setActive] = useState(false);
    const outerWrapperRef = useRef<HTMLDivElement>(null);

    const {
      clone,
      style,
      children,
      ghost,
      disableInteraction,
      handleProps,
      wrapperRef,
      indentationWidth,
      depth,
      layer,
      collapsed: _collapsed,
      ...rest
    } = props;
    const paddingLeft = indentationWidth * depth;

    const { layerTree_, setLayerTree_, setCurrentLayer, setFilter } =
      useAdministration();
    useShowCourseInStructure({
      layerId: String(layer.id),
      outerWrapperRef,
      onActive: setActive,
    });
    const { setLayerBeingHovered } = useUserLayerManagement();

    const handleDoubleClick = () => {
      if (!layer.children.length) return;
      const newTree = structureHandler.utils.layerTree.normalizeTree(layer);

      if (layerTree_) {
        setLayerTree_(newTree);
        setCurrentLayer(layer.id as string);
        setFilter("");
      }
    };

    return (
      <>
        <div ref={outerWrapperRef}>
          <li
            className={clsx(
              styles.Wrapper,
              clone && styles.clone,
              ghost && styles.ghost,
              ghost && styles.indicator,
              disableInteraction && styles.disableInteraction,
              !clone && "min-w-full",
              "group flex min-h-[48px] cursor-pointer items-center justify-between border-muted-contrast hover:bg-accent/50",
              active && "bg-primary/20 hover:bg-primary/30",
            )}
            onMouseEnter={() => setLayerBeingHovered(layer.id.toString())}
            onMouseLeave={() => setLayerBeingHovered("")}
            onDoubleClick={handleDoubleClick}
            ref={wrapperRef}
            style={
              {
                "--spacing": `${paddingLeft}px`,
              } as React.CSSProperties
            }
            {...rest}
          >
            <div
              className={clsx(
                "relative flex grow items-center p-2",
                clone ? "bg-foreground " : "bg-transparent",
                styles.TreeItem,
              )}
              ref={ref}
              style={style}
            >
              <Handle {...handleProps} />
              {children}
            </div>
          </li>
        </div>
      </>
    );
  },
);

Wrapper.displayName = "Wrapper";
export default React.memo(Wrapper);
