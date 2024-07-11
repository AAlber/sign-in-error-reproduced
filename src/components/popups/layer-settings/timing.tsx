import { useEffect } from "react";
import structureHandler from "@/src/client-functions/client-administration/structure-handler";
import classNames from "@/src/client-functions/client-utils";
import { toast } from "@/src/components/reusable/toaster/toast";
import useAdministration from "../../administration/zustand";
import DateTimePicker from "../../reusable/date-time-picker";
import Form from "../../reusable/formlayout";
import useLayerSettings from "./zustand";

export default function TimingSettings() {
  const { layer, startTime, endTime, setStartTime, setEndTime } =
    useLayerSettings();

  useEffect(() => {
    setStartTime(layer?.start || null);
    setEndTime(layer?.end || null);
  }, []);

  const { layerTree_ } = useAdministration();

  const parent = structureHandler.utils.layerTree
    .flattenTree(layerTree_ || [])
    .find((i) => layer && i.id === layer.parent_id);

  const hasParentTimeSpan = parent && (!!parent?.start || !!parent?.end);

  return (
    <Form>
      <Form.Item
        label="layer_settings_timing_start"
        description="layer_settings_timing_start_desc"
        descriptionBelowChildren
        align="top"
      >
        <div
          onClick={() => {
            if (hasParentTimeSpan)
              return toast.warning(
                "toast.layer_settings_warning_time_span_parent",
                {
                  description:
                    "toast.layer_settings_warning_time_span_parent_description",
                },
              );
          }}
          className={classNames(hasParentTimeSpan && "opacity-60", "w-full")}
        >
          <div
            className={classNames(hasParentTimeSpan && "pointer-events-none")}
          >
            <DateTimePicker
              value={startTime}
              setDate={setStartTime}
              placeholder="admin_dashboard.model_layer_settings_time_span_datepicker_start"
              onChange={(date) => setStartTime(date)}
            />
          </div>
        </div>
      </Form.Item>
      <Form.Item
        label="layer_settings_timing_end"
        description="layer_settings_timing_end_desc"
        descriptionBelowChildren
        align="top"
      >
        <div
          onClick={() => {
            if (hasParentTimeSpan)
              return toast.warning(
                "toast.layer_settings_warning_time_span_parent",
                {
                  description:
                    "toast.layer_settings_warning_time_span_parent_description",
                },
              );
          }}
          className={classNames(hasParentTimeSpan && "opacity-60", "w-full")}
        >
          <div
            className={classNames(hasParentTimeSpan && "pointer-events-none")}
          >
            <DateTimePicker
              value={endTime}
              placeholder="admin_dashboard.model_layer_settings_time_span_datepicker_end"
              onChange={(date) => setEndTime(date)}
            />
          </div>
        </div>
      </Form.Item>
    </Form>
  );
}
