import React from "react";
import type { Layer } from "@/src/components/administration/types";

const ContextMenu = (props: { layer: Layer }) => {
  const { layer } = props;

  return (
    <div className="ml-3 flex flex-row items-center rounded-sm border border-border bg-foreground px-2 text-xs text-muted-contrast">
      <button className="flex flex-row items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="13"
          viewBox="0 0 16 16"
          className="mr-1 fill-muted-contrast"
        >
          <path
            fillRule="evenodd"
            d="M1.5 1.5A.5.5 0 0 0 1 2v4.8a2.5 2.5 0 0 0 2.5 2.5h9.793l-3.347 3.346a.5.5 0 0 0 .708.708l4.2-4.2a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 8.3H3.5A1.5 1.5 0 0 1 2 6.8V2a.5.5 0 0 0-.5-.5z"
          />
        </svg>
        {layer.children.length}
      </button>
    </div>
  );
};

export default React.memo(ContextMenu);
