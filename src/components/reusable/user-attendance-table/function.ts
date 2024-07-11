import dayjs from "dayjs";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import Papa from "papaparse";
import type { AppointmentAttendanceUserLog } from "@/src/pages/api/schedule/attendence/get-attendance-logs-of-user";

export const exportUserAttendanceData = async (
  user: SimpleUser,
  userLogs: AppointmentAttendanceUserLog[],
) => {
  const zip = new JSZip();

  // Function to convert data to CSV and add it to the ZIP file
  const addToZip = (data, fileName) => {
    const csv = Papa.unparse(data);
    zip.file(fileName, csv);
  };

  // Filter and map the logs for each category
  const organizerLogs = userLogs
    .filter((log) => log.isOrganizer)
    .map(({ name, layerName, dateTime, duration }) => ({
      Name: name,
      "Layer / Course": layerName,
      Date: dayjs(dateTime).format("DD.MM.YY"),
      Duration: duration,
    }));

  const specialAccessLogs = userLogs
    .filter((log) => !log.isOrganizer && !log.isMember)
    .map(({ name, layerName, dateTime, duration }) => ({
      Name: name,
      "Layer / Course": layerName,
      Date: dayjs(dateTime).format("DD.MM.YY"),
      Duration: duration,
    }));

  const memberLogs = userLogs
    .filter((log) => log.isMember)
    .map(({ name, layerName, dateTime, duration, attended }) => ({
      Name: name,
      "Layer / Course": layerName,
      Date: dayjs(dateTime).format("DD.MM.YY"),
      Duration: duration,
      Attended: attended ? "Yes" : "No",
    }));

  // Add total duration row for organizer logs
  const totalOrganizerDuration = organizerLogs.reduce(
    (acc, log) => acc + log.Duration,
    0,
  );
  organizerLogs.push({
    Name: "Total",
    "Layer / Course": "",
    Date: "",
    Duration: totalOrganizerDuration,
  });

  // Add total duration row for special access logs
  const totalSpecialAccessDuration = specialAccessLogs.reduce(
    (acc, log) => acc + log.Duration,
    0,
  );
  specialAccessLogs.push({
    Name: "Total",
    "Layer / Course": "",
    Date: "",
    Duration: totalSpecialAccessDuration,
  });

  // Add total duration row for member logs
  const totalDuration = memberLogs.reduce((acc, log) => acc + log.Duration, 0);
  const totalAttendedDuration = memberLogs
    .filter((log) => log.Attended === "Yes")
    .reduce((acc, log) => acc + log.Duration, 0);
  memberLogs.push({
    Name: "Total",
    "Layer / Course": "",
    Date: "",
    Duration: totalDuration,
    Attended: String(totalAttendedDuration),
  });

  // Generate CSVs and add them to the ZIP
  addToZip(organizerLogs, "organizer_time_tracking.csv");
  addToZip(specialAccessLogs, "special_access_time_tracking.csv");
  addToZip(memberLogs, "member_time_tracking.csv");

  // Generate ZIP file and trigger download
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(
    content,
    `attendance_${user.name.toLocaleLowerCase().split(" ").join("_")}.zip`,
  );
};
