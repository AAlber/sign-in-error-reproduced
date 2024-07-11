import { useEffect } from "react";
import Slider from "../../reusable/slider";
import WidgetComponent from "../widget-component";
import { widgets } from "../widgets";
import useWidgetStore from "../zustand";

export default function WidgetStore() {
  const { open, setOpen, widgetsOnStore, widgetsOnDashboard } =
    useWidgetStore();

  useEffect(() => {
    if (widgetsOnDashboard.length === 5) {
      setOpen(false);
    }
  }, [widgetsOnDashboard]);

  return (
    <Slider open={open} setOpen={setOpen} position="bottom" fullScreen>
      <>
        <div className="grid gap-4 p-5 md:grid-cols-2 lg:grid-cols-4">
          {widgets
            .filter((widget) => widgetsOnStore.includes(widget.identifier))
            .map((widget) => {
              return (
                <WidgetComponent
                  key={widget.identifier}
                  widget={widget}
                  isInTheStore={true}
                />
              );
            })}
        </div>
      </>
    </Slider>
  );
}
