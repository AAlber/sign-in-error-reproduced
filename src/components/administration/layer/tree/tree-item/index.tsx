import type { HTMLAttributes } from "react";
import React, { forwardRef } from "react";
import type { Layer } from "@/src/components/administration/types";
import CourseComponent from "./component-course";
import LayerComponent from "./component-layer";
import Wrapper from "./wrapper";

export interface TreeItemProps
  extends Omit<HTMLAttributes<HTMLLIElement>, "id"> {
  clone?: boolean;
  collapsed?: boolean;
  depth: number;
  layer: Layer;
  disableInteraction?: boolean;
  ghost?: boolean;
  handleProps?: any;
  indentationWidth: number;
  wrapperRef?(node: HTMLLIElement): void;
}

const TreeItem = forwardRef<HTMLDivElement, TreeItemProps>((props, ref) => {
  return (
    <Wrapper ref={ref} {...props}>
      {props.layer.isCourse ? (
        <CourseComponent {...props} />
      ) : (
        <LayerComponent {...props} />
      )}
    </Wrapper>
  );
});

TreeItem.displayName = "TreeItem";
export default React.memo(TreeItem);
