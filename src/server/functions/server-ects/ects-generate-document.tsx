import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import React from "react";
import type { ECTsDataPoints } from "@/src/types/ects.types";
import { log } from "@/src/utils/logger/logger";
import { translateTextToUserPreferredLanguage } from "../server-user";
import { generateTableHeaders, generateTableRows } from "./common-utils";
import type {
  EctsAggregatedData,
  EctsExportDocumentArgs,
  TableHeaders,
} from "./types";

Font.register({
  family: "Open Sans",
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf",
    },
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf",
      fontWeight: 900,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    padding: 20,
  },
  table: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderColor: "black",
    fontFamily: "Open Sans",
  },
  tableHeaderFirst: {
    flex: 1.5, // making the first column wider
    padding: 2,
    fontFamily: "Open Sans",
    fontWeight: 900,
  },
  tableCellFirst: {
    flex: 1.5, // making the first column wider
    padding: 2,
    fontFamily: "Open Sans",
  },
  tableHeader: {
    flex: 1,
    padding: 2,
    fontFamily: "Open Sans",
    fontWeight: 900,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "black",
    fontFamily: "Open Sans",
  },
  tableCell: {
    flex: 1,
    padding: 2,
    fontFamily: "Open Sans",
  },
  title: {
    fontFamily: "Open Sans",
    fontWeight: 900,
    fontSize: 10,
  },
  bold: {
    fontFamily: "Open Sans",
    fontWeight: 900,
  },
});

export default function GenerateEctsDocument(args: EctsExportDocumentArgs) {
  log.context("GenerateEctsDocument", args);
  log.info("Generating ECTS PDF Document");

  const t = (text: string) =>
    translateTextToUserPreferredLanguage(text, undefined, args.data.language);

  const tableRowArgs = generateTableHeaders(args);
  const { dataPoints, data } = args;

  const colsBeforePoints: (keyof ECTsDataPoints)[] = [
    "attendance",
    "prerequisites",
  ];

  const placeholderColsBeforePoints = colsBeforePoints.filter(
    (c) => dataPoints[c],
  );

  // Create the HEADER component for this PDF
  const tableHeader = (
    <View style={styles.table}>
      {/* Table headers */}
      <Text style={styles.tableHeaderFirst}>{t("ects_pdf.header.name")}</Text>
      {tableRowArgs.hasTimeConstrainingLayer && (
        <Text style={styles.tableHeader}></Text>
      )}

      {dataPoints.attendance && (
        <Text style={styles.tableHeader}>
          {t("ects_pdf.header.attendance")}
        </Text>
      )}

      {dataPoints.prerequisites && (
        <Text style={styles.tableHeader}>
          {t("ects_pdf.header.prerequisites")}
        </Text>
      )}

      {dataPoints.points && (
        <Text style={styles.tableHeader}>{t("ects_pdf.header.points")}</Text>
      )}

      {dataPoints.status && (
        <Text style={styles.tableHeader}>{t("ects_pdf.header.status")}</Text>
      )}
    </View>
  );

  let totalPoints = 0;

  // Create the ROWS component for this PDF
  let tableRows: JSX.Element[];

  if (data.type === "grouped") {
    tableRows = data.tableObjectGroups.map((group) => {
      const rows = generateTableRows(group.tableObjects);
      totalPoints = rows[0]?.totalPoints ?? 0;
      return (
        <React.Fragment key={group.name}>
          {/* Group title row */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCellFirst, styles.title]}>
              {group.name}
            </Text>
            {_createPlaceHolderColumns(placeholderColsBeforePoints.length)}
            {dataPoints.points && (
              <>
                <Text style={[styles.tableCell, styles.title]}>
                  {totalPoints}
                </Text>
                {dataPoints.status && _createPlaceHolderColumns(1)}
              </>
            )}
          </View>
          {/* Table rows for the group */}
          {_createTableRows(rows, tableRowArgs)}
        </React.Fragment>
      );
    });
  } else {
    const rows = generateTableRows(data.tableObjects);
    totalPoints = rows[0]?.totalPoints ?? 0;
    tableRows = _createTableRows(rows, tableRowArgs);
  }

  // Last row for total points
  const totalPointsRow = (
    <View style={styles.tableRow}>
      <Text style={[styles.tableCellFirst, styles.bold]}>
        {t("ects_pdf.header.total_points")}
      </Text>
      {_createPlaceHolderColumns(colsBeforePoints.length)}
      <Text style={[styles.tableCell, styles.bold]}>{totalPoints}</Text>
      {dataPoints.status && _createPlaceHolderColumns(1)}
    </View>
  );

  return (
    <Document>
      <Page style={styles.page}>
        {tableHeader}
        {tableRows}
        {data.type === "flat" && totalPointsRow}
      </Page>
    </Document>
  );
}

function _createTableRows(rows: EctsAggregatedData[], th: TableHeaders) {
  return rows.map((row) => (
    <View key={row.layerId} style={styles.tableRow}>
      <Text style={styles.tableCellFirst}>{row.name}</Text>
      {th.hasTimeConstrainingLayer && (
        <Text style={styles.tableCell}>{row.hasTimeConstrainingLayer}</Text>
      )}

      {th.attendance && <Text style={styles.tableCell}>{row.attendance}</Text>}
      {th.prerequisites && (
        <Text style={styles.tableCell}>{row.prerequisites}</Text>
      )}

      {th.points && <Text style={styles.tableCell}>{row.points}</Text>}
      {th.status && <Text style={styles.tableCell}>{row.status}</Text>}
    </View>
  ));
}

function _createPlaceHolderColumns(cols: number) {
  return (
    <React.Fragment>
      {new Array(cols).fill(undefined).map((_i, idx) => {
        return <Text key={idx} style={styles.tableCell} />;
      })}
    </React.Fragment>
  );
}
