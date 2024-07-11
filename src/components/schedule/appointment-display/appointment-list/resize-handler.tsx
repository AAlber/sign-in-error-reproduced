import React from "react";

type Props = {
  setIsResizing: (data: boolean) => void;
};

const ResizeHandler = React.forwardRef<HTMLDivElement, Props>(
  ({ setIsResizing }, ref) => {
    return (
      <div
        className="absolute bottom-1 h-2 w-full cursor-ns-resize rounded-b-md bg-transparent"
        onMouseDown={() => setIsResizing(true)}
        ref={ref}
      />
    );
  },
);

ResizeHandler.displayName = "ResizeHandler";
export default ResizeHandler;
