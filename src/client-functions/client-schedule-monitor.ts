import useInstitutionSettingsScheduleMonitor from "../components/institution-settings/setting-containers/insti-settings-schedule-monitor/zustand";
import { toast } from "../components/reusable/toaster/toast";
import api from "../pages/api/api";

export async function addLayerToMonitor(layerId: string) {
  const { setLoading } = useInstitutionSettingsScheduleMonitor.getState();

  setLoading(true);
  const response = await fetch(api.addLayerToMonitor, {
    method: "POST",
    body: JSON.stringify({
      layerId,
    }),
  });

  if (!response.ok) {
    setLoading(false);
    toast.responseError({
      response,
      title: "toast_schedule_monitor_error1",
    });
    return;
  }

  await refreshMonitorLayers();
  setLoading(false);
  return response;
}

export async function refreshMonitorLayers() {
  const { setLayers, setAllLayers } =
    useInstitutionSettingsScheduleMonitor.getState();

  const response = await fetch(api.getLayersOfMonitor, { method: "GET" });

  if (!response.ok) {
    toast.responseError({
      response,
      title: "toast_schedule_monitor_error2",
    });
    return [];
  }

  const data = (await response.json()) as {
    layer: { name: string; displayName: OrNull<string> };
    layerId: string;
  }[];

  setLayers(data);
  setAllLayers(data);
  return data;
}

export async function removeLayerFromMonitor(layerId: string) {
  const { setLoading } = useInstitutionSettingsScheduleMonitor.getState();
  setLoading(true);

  const response = await fetch(api.removeLayerFromMonitor, {
    method: "POST",
    body: JSON.stringify({
      layerId,
    }),
  });

  if (!response.ok) {
    setLoading(false);
    toast.responseError({
      response,
      title: "toast_schedule_monitor_error3",
    });
    return;
  }

  await refreshMonitorLayers();
  setLoading(false);
  return response;
}

export async function updateLayerPositions(
  layers: { id: string; position: number }[],
) {
  const { setLoading } = useInstitutionSettingsScheduleMonitor.getState();
  setLoading(true);
  const response = await fetch(api.updateLayerPositions, {
    method: "POST",
    body: JSON.stringify({
      layers,
    }),
  });

  if (!response.ok) {
    toast.responseError({
      response,
      title: "toast_schedule_monitor_error4",
    });
    return;
  }

  await refreshMonitorLayers();
  setLoading(false);
  return response;
}
