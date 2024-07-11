import { Expand, Minimize } from "lucide-react";
import { Button } from "../reusable/shadcn-ui/button";
import WithToolTip from "../reusable/with-tooltip";
import useSchedule from "./zustand";

export const MonitorFullscreenButton = () => {
  const { fullScreen, setFullScreen } = useSchedule();

  return (
    <Button variant={"ghost"} onClick={() => setFullScreen(!fullScreen)}>
      <WithToolTip text={fullScreen ? "minimize" : "expand"}>
        {!fullScreen ? (
          <Expand className="size-4 text-contrast" />
        ) : (
          <Minimize className="size-4 text-contrast" />
        )}
      </WithToolTip>
    </Button>
  );
};
