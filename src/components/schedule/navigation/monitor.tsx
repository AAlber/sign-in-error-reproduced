import structureHandler from "@/src/client-functions/client-administration/structure-handler";
import classNames from "@/src/client-functions/client-utils";
import useInstitutionSettingsScheduleMonitor from "../../institution-settings/setting-containers/insti-settings-schedule-monitor/zustand";

export default function MonitorDayDisplay() {
  const { layers } = useInstitutionSettingsScheduleMonitor();

  return (
    <>
      {layers.map((layer, i) => (
        <div
          key={i}
          className={classNames(
            "flex items-center justify-center border-l border-border py-1.5 ",
          )}
        >
          <span
            className={
              "inline-flex h-8 w-full items-center justify-center text-sm text-contrast"
            }
          >
            {structureHandler.utils.layerTree.getLayerNameToShow(layer.layer)}
          </span>
        </div>
      ))}
    </>
  );
}
