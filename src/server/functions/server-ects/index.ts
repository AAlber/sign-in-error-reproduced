import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest } from "next";
import {
  createFileForExport,
  populateDataToExport,
  uploadBlobToS3,
} from "@/src/server/functions/server-ects/common-utils";
import { getEctsDataOfUser } from "@/src/server/functions/server-ects/ects-course-data";
import { compressFiles } from "@/src/server/functions/server-ects/ects-export-zip";
import { isAdmin } from "@/src/server/functions/server-role";
import {
  getCurrentInstitutionId,
  getUser,
} from "@/src/server/functions/server-user";
import type {
  GetEctsDataExportArgs,
  GetEctsDataExportForManyArgs,
} from "@/src/types/ects.types";
import { HttpError } from "@/src/utils/exceptions/http-error";
import { log } from "@/src/utils/logger/logger";

export async function generateEctsExportData(
  data: GetEctsDataExportArgs,
  institutionId: string,
) {
  return log.timespan("Generate ECTS Export Data", async () => {
    const { dataPoints, format, markCoursesAsInProgress, ...otherData } = data;

    const populatedData = await populateDataToExport(
      otherData,
      markCoursesAsInProgress,
    );
    const user = await getUser(otherData.userId);
    if (!user) throw new HttpError("User not found", 400);

    const file = await createFileForExport({
      dataPoints,
      format,
      institutionId,
      user,
      ...populatedData,
    });

    const url = await uploadBlobToS3(file.blob, institutionId);
    return url;
  });
}

export async function generateEctsExportDataForMany(
  data: GetEctsDataExportForManyArgs,
  institutionId: string,
) {
  return log.timespan("Generate ECTS Export Data For Many", async () => {
    const { userIds, format, dataPoints, type, markCoursesAsInProgress } = data;

    const ectsDataOfManyUsers = await Promise.all(
      userIds.map((uid) => {
        return getEctsDataOfUser(uid, type, markCoursesAsInProgress);
      }),
    );

    const files = await Promise.all(
      ectsDataOfManyUsers.map(({ user, language, ...data }) => {
        return createFileForExport({
          ...data,
          user,
          language,
          dataPoints,
          institutionId,
          format,
        });
      }),
    );

    const output = await compressFiles(files);
    const url = await uploadBlobToS3(output, institutionId);

    return url;
  });
}

export async function validateEctsExportRequest(req: NextApiRequest) {
  return log.timespan("Validate ECTS Export Request", async () => {
    const { userId } = getAuth(req);

    if (!userId) {
      throw new HttpError("Unauthorized", 401);
    }

    const institutionId = await getCurrentInstitutionId(userId!);
    if (!institutionId) {
      throw new HttpError("No institution selected", 400);
    }

    const hasPermission = await isAdmin({ userId: userId!, institutionId });
    if (!hasPermission) {
      throw new HttpError("Unauthorized", 401);
    }

    return { userId, institutionId };
  });
}
