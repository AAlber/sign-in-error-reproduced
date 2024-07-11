import { track } from "@vercel/analytics";
import { downloadFile } from "@/src/client-functions/client-utils";
import { log } from "@/src/utils/logger/logger";

export type UserCSVData<T> = { username: string } & T;

function generateCSVHeaders(data: any[]): string[] {
  return Object.keys(data[0]);
}

function sanitizeFieldValue(fieldValue: string): string {
  if (
    fieldValue.includes(",") ||
    fieldValue.includes("\n") ||
    fieldValue.includes('"')
  ) {
    return `"${fieldValue.replace(/"/g, '""')}"`;
  }
  return fieldValue;
}

function generateCSVRows(data: any[], headers: string[]): string[] {
  return data.map((row) =>
    headers.map((fieldName) => sanitizeFieldValue(row[fieldName])).join(","),
  );
}

function createCSVString(headers: string[], rows: string[]): string {
  return [headers.join(","), ...rows].join("\n");
}

function initiateDownload(
  csvString: string,
  fileBaseName: string,
  fileNameSuffix?: string,
) {
  const csvBlob = new Blob([csvString], { type: "text/csv" });

  const fileName = fileNameSuffix
    ? `${fileBaseName}-${fileNameSuffix}.csv`
    : `${fileBaseName}.csv`;

  downloadFile(fileName, csvBlob);
}

function exportUserData<T extends Record<string, any>>(
  data: UserCSVData<T>[],
  fileBaseName: string,
  fileNameSuffix?: string,
): string {
  try {
    log.context("Exporting CSV user data: ", {
      data,
      fileBaseName,
      fileNameSuffix,
    });
    log.info(
      "Exporting user data for " + fileBaseName + (fileNameSuffix || ""),
    );

    if (!data[0]) throw new Error("No data available at data[0]");

    const headers = generateCSVHeaders(data);
    const rows = generateCSVRows(data, headers);
    const csvString = createCSVString(headers, rows);

    log.info("Generated CSV string to download", { csv: csvString });
    track("Exported user data", { file: fileBaseName });

    initiateDownload(csvString, fileBaseName, fileNameSuffix);
  } catch (error) {
    log.error(error);
  }
  return "";
}

export default exportUserData;
