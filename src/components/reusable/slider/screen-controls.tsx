import { Calendar, Maximize2, Minimize2, Monitor } from "lucide-react";
import useUser from "@/src/zustand/user";
import useScheduleSlider from "../../schedule-slider/zustand";
import { Button } from "../shadcn-ui/button";

const ScreenControls = (props: {
  fullScreen?: boolean;
  setFullScreen?: (fullScreen: boolean) => void;
  fullScreenAvailable?: boolean;
  halfScreen?: boolean;
  setHalfScreen?: (halfScreen: boolean) => void;
  halfScreenAvailable?: boolean;
}) => {
  const { user } = useUser();
  const isFullScreenAvailable =
    props.fullScreenAvailable && props.setFullScreen;
  const isHalfScreenAvailable =
    props.halfScreenAvailable && props.setHalfScreen;
  const showMaximizeIcon =
    isFullScreenAvailable && !props.fullScreen && !props.halfScreen;
  const showHalfScreenIcon =
    isHalfScreenAvailable && !props.halfScreen && !props.fullScreen;
  const showMinimizeIcon =
    (isFullScreenAvailable && props.fullScreen) ||
    (isHalfScreenAvailable && props.halfScreen);
  const { fullScreen, initMonitor, monitorMode, initSchedule } =
    useScheduleSlider();

  return (
    <>
      {showMaximizeIcon && (
        <Button
          variant={"ghost"}
          size={"iconSm"}
          onClick={() => props.setFullScreen!(true)}
        >
          <Maximize2
            className="h-4 w-4 cursor-pointer text-contrast hover:opacity-80 "
            aria-hidden="true"
          />{" "}
        </Button>
      )}
      {!monitorMode && showMinimizeIcon && (
        <Button
          variant={"ghost"}
          size={"iconSm"}
          onClick={() => {
            if (props.setFullScreen) props.setFullScreen(false);
            if (props.setHalfScreen) props.setHalfScreen(false);
          }}
        >
          <Minimize2 className="h-4 w-4" aria-hidden="true" />{" "}
        </Button>
      )}
      {user.institution?.institutionSettings.addon_schedule_monitor && (
        <Button
          variant={"ghost"}
          size={"iconSm"}
          onClick={() => {
            if (!monitorMode) return initMonitor();
            initSchedule();
          }}
        >
          {monitorMode ? (
            <Calendar className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Monitor className="h-4 w-4" aria-hidden="true" />
          )}
        </Button>
      )}
    </>
  );
};

export default ScreenControls;
