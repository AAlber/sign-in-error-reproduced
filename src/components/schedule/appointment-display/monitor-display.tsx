import { useEffect } from "react";
import { getLayersAndChildrenWithAppointments } from "@/src/client-functions/client-appointment";
import { refreshMonitorLayers } from "@/src/client-functions/client-schedule-monitor";
import { delay } from "@/src/client-functions/client-utils";
import { toast } from "@/src/components/reusable/toaster/toast";
import { log } from "@/src/utils/logger/logger";
import useInstitutionSettingsScheduleMonitor from "../../institution-settings/setting-containers/insti-settings-schedule-monitor/zustand";
import { useInstitutionSettings } from "../../institution-settings/zustand";
import useScheduleSlider from "../../schedule-slider/zustand";
import TimePointerLine from "../time-pointer";
import useSchedule from "../zustand";
import AppointmentList from "./appointment-list";
import BorderOverlay from "./border-overlay";

export default function AppointmentMonitorDisplay() {
  const {
    appointments,
    selectedDay,
    refresh,
    refreshAppointments,
    setLoading,
    setAppointments,
  } = useSchedule();
  const { open, monitorMode } = useScheduleSlider();
  const { layers, setLayers, page, setPage } =
    useInstitutionSettingsScheduleMonitor();

  const institutionSettings = useInstitutionSettings(
    (state) => state.institutionSettings,
  );

  const totalColumns = layers.length * 10;

  useEffect(() => {
    updateLayersAndChildrenWithAppointments();
  }, [refresh, page, selectedDay.toString()]);

  useEffect(() => {
    startMonitoring();
    setPage(0);
  }, [open]);

  const updateLayersAndChildrenWithAppointments = async () => {
    try {
      setLoading(true);
      const data = await refreshMonitorLayers();
      const layerIds = data.map((d) => d.layerId);

      const updatedAppointments = await getLayersAndChildrenWithAppointments(
        layerIds,
        selectedDay,
      );

      setAppointments(updatedAppointments);
      await delay(500);
      filterAndSliceLayers(updatedAppointments, data);
    } catch (error) {
      log.error(error);
      console.error(
        "Failed to update layers and children with appointments:",
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  function filterAndSliceLayers(updatedAppointments, layers) {
    const filteredLayers = layers.filter((layer) =>
      shouldShowLayer(layer, updatedAppointments),
    );
    setLayers(sliceLayers(filteredLayers));
  }

  function shouldShowLayer(layer, updatedAppointments) {
    return (
      institutionSettings.schedule_monitor_show_empty_columns ||
      appointmentBelongsToLayer(updatedAppointments, layer)
    );
  }

  function appointmentBelongsToLayer(updatedAppointments, layer) {
    console.log(updatedAppointments, layer);
    return updatedAppointments.some((appointment) =>
      appointment.appointmentLayers.some((l) => l.layerId === layer.layerId),
    );
  }

  function sliceLayers(filteredLayers) {
    return institutionSettings.schedule_monitor_split_every === 0
      ? filteredLayers
      : filteredLayers.slice(
          page * institutionSettings.schedule_monitor_split_every,
          page * institutionSettings.schedule_monitor_split_every +
            institutionSettings.schedule_monitor_split_every,
        );
  }

  function startMonitoring() {
    if (open && monitorMode) {
      showMonitoringToast();
      const interval = setInterval(refreshAppointments, 1000 * 60 * 5);
      return () => clearInterval(interval);
    }
  }

  function showMonitoringToast() {
    toast.success("toast.monitor_display_sucess_title", {
      icon: "📡",
      description: "toast.monitor_display_sucess_description",
    });
  }

  function getLayerAppointments(layer) {
    return appointments.filter(
      (appointment) => (appointment as any).originalLayerId === layer.layerId,
    );
  }

  return (
    <ol
      className="pointer-events-none relative col-span-full row-start-1 grid w-full"
      style={{
        gridTemplateRows: "1.75rem repeat(288, minmax(0.75rem, 1fr)) auto",
        gridTemplateColumns: `repeat(${totalColumns}, 1fr)`,
      }}
    >
      <TimePointerLine />
      <BorderOverlay borderCount={layers.length} />
      {appointments &&
        appointments.length > 0 &&
        layers.map((layer, index) => (
          <AppointmentList
            key={layer.layerId}
            appointments={getLayerAppointments(layer)}
            offset={index * 10}
            monitorMode
          />
        ))}
    </ol>
  );
}
