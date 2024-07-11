import Slider from "../reusable/slider";
import Schedule from "../schedule";
import ScheduleMonitor from "../schedule/monitor";
import useScheduleFilter from "../schedule/zustand-filter";
import useScheduleSlider from "./zustand";

export default function ScheduleSlider() {
  const {
    open,
    fullScreen,
    monitorMode,
    halfScreen,
    setHalfScreen,
    setFullScreen,
    setOpen,
  } = useScheduleSlider();
  const { filteredLayers } = useScheduleFilter();

  return (
    <Slider
      open={open}
      setOpen={setOpen}
      fullScreenAvailable
      fullScreen={fullScreen}
      setFullScreen={setFullScreen}
      halfScreenAvailable
      halfScreen={halfScreen}
      setHalfScreen={setHalfScreen}
    >
      <>
        {!monitorMode && <Schedule filteredLayerIds={filteredLayers} />}
        {monitorMode && <ScheduleMonitor />}
      </>
    </Slider>
  );
}
