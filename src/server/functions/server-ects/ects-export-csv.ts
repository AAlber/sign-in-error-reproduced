import * as xlsx from "xlsx";
import type { ECTsDataPoints } from "@/src/types/ects.types";
import { filterUndefined } from "@/src/utils/utils";
import { getUser, translateTextToUserPreferredLanguage } from "../server-user";
import { generateTableRows } from "./common-utils";
import type { EctsAggregatedData, EctsExportDocumentArgs } from "./types";

export async function createCsv(args: EctsExportDocumentArgs) {
  const table = await _createCsvTable(args);
  return _createEctsCsv(table);
}

async function _createCsvTable({
  data,
  dataPoints,
  user: dbUser,
}: EctsExportDocumentArgs) {
  const user = dbUser ? dbUser : await getUser(data.userId);
  const language = user?.language ?? "en";

  if (data.type === "flat") {
    const rows = generateTableRows(data.tableObjects);
    return _normalizeRowsForCsv(rows, dataPoints, language);
  }

  // basically for csv dataType is always flat
  const groupedRows = data.tableObjectGroups.map((group) => {
    const rows = generateTableRows(group.tableObjects);
    return _normalizeRowsForCsv(rows, dataPoints, language);
  });

  return groupedRows.flatMap((g) => g);
}

function _normalizeRowsForCsv(
  rows: EctsAggregatedData[],
  dataPoints: ECTsDataPoints,
  language: string,
): Record<string, string>[] {
  const t = (text: string) =>
    translateTextToUserPreferredLanguage(text, undefined, language);

  return rows.map((row) => {
    const entries = Object.entries(row) as [
      keyof EctsAggregatedData,
      EctsAggregatedData[keyof EctsAggregatedData],
    ][];

    const items = entries
      .map(([key, value]) => {
        let translatedKey = "";

        switch (true) {
          case key === "hasTimeConstrainingLayer":
          case key === "totalPoints":
          case key === "layerId":
            // remove other columns you don't want to be included in the csv output
            return;
          case key === "attendance":
            translatedKey = t("ects_pdf.header.attendance");
            break;
          case key === "prerequisites":
            translatedKey = t("ects_pdf.header.prerequisites");
            break;
          case key === "points":
            translatedKey = t("ects_pdf.header.points");
            break;
          case key === "status":
            translatedKey = t("ects_pdf.header.status");
            break;
          default:
            translatedKey = t(key);
        }

        return key in dataPoints
          ? dataPoints[key]
            ? [translatedKey, value]
            : undefined
          : [translatedKey, value];
      })
      .filter(filterUndefined);

    return Object.fromEntries(items);
  });
}

function _createEctsCsv(data: Partial<EctsAggregatedData>[]) {
  const worksheet = xlsx.utils.json_to_sheet(data);
  const csv = xlsx.utils.sheet_to_csv(worksheet);
  return new Blob([csv]);
}
