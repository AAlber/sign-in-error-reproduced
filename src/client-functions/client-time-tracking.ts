import dayjs from "dayjs";
import Papa from "papaparse";
import { toast } from "../components/reusable/toaster/toast";
import api from "../pages/api/api";
import type { TimeTrackingData } from "../types/time-tracking.types";
import { TimeTrackingExportType } from "../types/time-tracking.types";
import { downloadFileFromUrl } from "./client-utils";

export async function getTimeTrackingDataForUser(userId: string) {
  const response = await fetch(api.getTrackingDataForUser + userId, {
    method: "GET",
  });
  if (!response.ok)
    toast.responseError({
      response,
      title: "toast_time_tracking_error",
    });
  const data: TimeTrackingData = await response.json();
  return data;
}

export async function exportTimeTrackingDataAsCSV(
  data: TimeTrackingData,
  type: TimeTrackingExportType,
) {
  const { appointments } = data;

  const date = new Date();

  switch (type) {
    case TimeTrackingExportType.LAST_DAY:
      date.setDate(date.getDate() - 1);
      break;
    case TimeTrackingExportType.LAST_WEEK:
      date.setDate(date.getDate() - 7);
      break;
    case TimeTrackingExportType.LAST_MONTH:
      date.setMonth(date.getMonth() - 1);
      break;
    case TimeTrackingExportType.LAST_YEAR:
      date.setFullYear(date.getFullYear() - 1);
      break;
    default:
      date.setTime(0);
      break;
  }

  // Convert the appointments data to CSV
  const formattedAppointments = appointments
    .filter((a) => dayjs(a.dateTime).toDate().getTime() > date.getTime())
    .map((appointment) => {
      const startDate = dayjs(appointment.dateTime);
      const endDate = startDate.add(appointment.duration, "minutes");
      return {
        Title: appointment.title,
        Duration: appointment.duration,
        Start: startDate.format("DD MMM YYYY HH:mm "),
        End: endDate.format("DD MMM YYYY HH:mm "),
        Path: appointment.layerPath,
      };
    });

  // Prepare data for CSV
  const csvAppointments = Papa.unparse(formattedAppointments);
  const csvData = `${csvAppointments}`;

  const csvBlob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(csvBlob);
  downloadFileFromUrl("time-tracking-data.csv", url);
}
