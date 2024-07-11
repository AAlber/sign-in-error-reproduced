import cuid from "cuid";
import { Readable } from "stream";
import type {
  ECTsDataPoints,
  EctsExportData,
  EctsExportDataWithUserData,
  EctsExportFormat,
  ECTsTableItem,
} from "@/src/types/ects.types";
import { HttpError } from "@/src/utils/exceptions/http-error";
import { round } from "@/src/utils/utils";
import { R2 } from "../../singletons/s3";
import { s3Commands } from "../server-cloudflare/blob-storage/s3-commands";
import { fillWithData } from "./ects-course-data";
import { createPdf } from "./ects-document-functions";
import { createCsv } from "./ects-export-csv";
import { createZip } from "./ects-export-zip";
import type {
  EctsAggregatedData,
  EctsExportDocumentArgs,
  TableHeaders,
} from "./types";

export function generateTableHeaders({
  data,
  dataPoints,
}: EctsExportDocumentArgs): TableHeaders {
  const hasTimeConstrainingLayer =
    data.type === "flat"
      ? data.tableObjects.some((i) => !!i.timeConstrainingLayer)
      : data.tableObjectGroups.some((i) =>
          i.tableObjects.some((j) => !!j.timeConstrainingLayer),
        );

  return {
    ...dataPoints,
    hasTimeConstrainingLayer,
  };
}

export function generateTableRows(
  courses: ECTsTableItem[],
): EctsAggregatedData[] {
  const totalPoints = courses.reduce(
    (prev, curr) => prev + (curr.points ?? 0),
    0,
  );

  // order of keys is important here, this will determine order in csv
  return courses.map((course) => {
    const attendancePercentage = Math.round(
      Math.min(
        (course.attendancePercentage ?? 0) /
          (course.attendancePercentageGoal ?? 1),
        1,
      ) * 100,
    );

    return {
      name: course.name,
      status: course.status?.toString() ?? "in-progress",
      prerequisites: `${course.passedPrerequisitesCount}/${course.prerequisitesCount}`,
      hasTimeConstrainingLayer: course.timeConstrainingLayer ?? "false",
      points: course.points?.toString() ?? "0",
      layerId: course.layer_id,
      attendance: isNaN(attendancePercentage)
        ? "0%"
        : `${attendancePercentage}%`,
      totalPoints: round(totalPoints, 1),
    };
  });
}

export async function converBlobToBuffer(blob: Blob) {
  const rBuf = await blob.arrayBuffer();
  return Buffer.from(rBuf);
}

export async function uploadBlobToS3(blob: Blob, institutionId: string) {
  const stream = blob.stream() as unknown as NodeJS.ReadableStream;
  const nodeStream = Readable.from(stream);
  const key = "institutions/" + institutionId + "/ects/temp/" + cuid() + ".pdf";

  const putCommand = s3Commands.put(key, {
    Body: nodeStream,
    ContentLength: blob.size,
  });

  await R2.send(putCommand);
  const url = process.env.NEXT_PUBLIC_WORKER_URL + "/" + key;
  return url;
}

export async function createFileForExport({
  dataPoints,
  format,
  institutionId,
  language,
  user,
  userId,
  ...data
}: EctsExportDataWithUserData & {
  dataPoints: ECTsDataPoints;
  institutionId: string;
  format: EctsExportFormat;
}) {
  const name = user.name.replaceAll(" ", "-");
  const args: EctsExportDocumentArgs = {
    user,
    institutionId,
    language,
    dataPoints,
    data: { ...data, userId },
  };

  switch (format) {
    case "csv": {
      return {
        filename: name + ".csv",
        blob: await createCsv(args),
      };
    }
    case "pdf": {
      return {
        filename: name + ".pdf",
        blob: await createPdf(args),
      };
    }
    case "zip":
      return {
        filename: name + ".zip",
        blob: await createZip(args),
      };
    default:
      throw new HttpError("Unsupported format", 400);
  }
}

/** Operation directly mutates data and fills it with contents for export */
export async function populateDataToExport(
  data: EctsExportData,
  markCoursesAsInProgress: boolean,
) {
  if (data.type === "grouped") {
    await Promise.all(
      data.tableObjectGroups.flatMap((group) =>
        group.tableObjects.map((d) =>
          fillWithData(data.userId, markCoursesAsInProgress, d),
        ),
      ),
    );
  } else {
    await Promise.all(
      data.tableObjects.map((d) =>
        fillWithData(data.userId, markCoursesAsInProgress, d),
      ),
    );
  }

  return data;
}
