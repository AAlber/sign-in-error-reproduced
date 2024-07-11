import produce from "immer";
import { toast } from "@/src/components/reusable/toaster/toast";
import useECTsExport from "@/src/components/reusable/user-overview-sheet/user-overview-content/user-overview-tables/user-ects-export-table/zustand";
import api from "@/src/pages/api/api";
import type {
  EctsExportData,
  EctsExportFormat,
  EctsPdfUploads,
  ECTsStructure,
  GetEctsData,
  GetEctsDataExportArgs,
  GetEctsDataExportForManyArgs,
} from "@/src/types/ects.types";
import { log } from "@/src/utils/logger/logger";
import { deleteCloudflareDirectories } from "../client-cloudflare";
import { downloadFileFromUrl } from "../client-utils";

export async function getCoursesForEctsExport(
  data: GetEctsData,
): Promise<ECTsStructure | null> {
  log.context("getCoursesForEctsExport", data);
  return log.timespan("Get courses for ects export", async () => {
    try {
      const url = new URL(api.getCoursesForEctsExport, window.location.origin);
      url.searchParams.append("userId", data.userId);
      url.searchParams.append("type", data.type);
      url.searchParams.append(
        "includeTimeConstrainingLayer",
        String(data.includeTimeConstrainingLayer),
      );
      const response = await fetch(url);

      if (!response.ok) {
        log.response(response);
        toast.responseError({
          response,
          title: "Failed to get courses",
        });
        throw new Error("Failed to fetch courses for ects export");
      }
      return await response.json();
    } catch (e) {
      log.error(e);
      return null;
    }
  });
}

export async function getManyUsersDataForEctsExport(
  userIds: string[],
  format: EctsExportFormat,
) {
  const state = useECTsExport.getState();

  const payload = {
    userIds,
    format,
    type: state.exportStructure,
    markCoursesAsInProgress: state.markCoursesAsInProgress,
    dataPoints: {
      attendance: state.attendance,
      points: state.points,
      prerequisites: state.prerequisites,
      status: state.status,
    },
  } satisfies GetEctsDataExportForManyArgs;

  const response = await fetch(api.getDataForEctsExportForMany, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    log.response(response);
    toast.error("something_went_wrong", {
      description: "unexpected_error_description",
    });

    return;
  }

  const { url } = await response.json();
  await downloadFileFromUrl("ects-export-data.zip", url, false);

  deleteCloudflareDirectories([
    {
      url,
      isFolder: false,
    },
  ]);
}

export async function getDataForEctsExport(
  data: EctsExportData,
  name: string,
  format: EctsExportFormat,
) {
  log.context("getDataForEctsExport", data);
  return log.timespan("getDataForEctsExport", async () => {
    try {
      const state = useECTsExport.getState();

      let payload = {
        ...data,
        format,
        markCoursesAsInProgress: state.markCoursesAsInProgress,
        dataPoints: {
          attendance: state.attendance,
          points: state.points,
          prerequisites: state.prerequisites,
          status: state.status,
        },
      } satisfies GetEctsDataExportArgs;

      // filter out only the selected courses
      if (payload.type === "flat") {
        payload.tableObjects = payload.tableObjects.filter((obj) =>
          state.selectedCourseIds.includes(obj.layer_id),
        );
      } else {
        payload = produce(payload, (draft) => {
          draft.tableObjectGroups.forEach((tableGroup, idx) => {
            const filteredCourses = tableGroup.tableObjects.filter((course) =>
              state.selectedCourseIds.includes(course.layer_id),
            );

            const group = draft.tableObjectGroups[idx];
            if (group) group.tableObjects = filteredCourses;
          });

          draft.tableObjectGroups = draft.tableObjectGroups.filter(
            (j) => !!j.tableObjects.length,
          );
        });
      }

      const response = await fetch(api.getDataForEctsExport, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // Handle error response
        log.response(response);
        toast.error("something_went_wrong", {
          description: "unexpected_error_description",
        });

        throw new Error("getDataForEctsExport error");
      }

      const { url } = await response.json();
      await downloadFileFromUrl(name + `.${format.toLowerCase()}`, url, false);

      deleteCloudflareDirectories([
        {
          url,
          isFolder: false,
        },
      ]);
    } catch (e) {
      log.error(e);
    }
  });
}

export async function getEctsPdfUploadKeys() {
  return log.timespan("getEctsPdfUploadKeys", async () => {
    try {
      const response = await fetch(api.getEctsPdfUploadKeys);
      if (!response.ok) {
        log.response(response);
        toast.error("something_went_wrong", {
          description: "unexpected_error_description",
        });
        throw new Error("unable to fetch getEctsPdfUploadKeys");
      }
      const data = await response.json();
      return data as EctsPdfUploads;
    } catch (e) {
      log.error(e);
      return {};
    }
  });
}

export async function setEctsPdfUploadKey(body: EctsPdfUploads) {
  log.context("setEctsPdfUploadKey", body);
  return log.timespan("setEctsPdfUploadKey", async () => {
    try {
      const response = await fetch(api.setEctsPdfUploadKeys, {
        method: "POST",
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        log.response(response);
        toast.error("something_went_wrong", {
          description: "unexpected_error_description",
        });
        throw new Error("unable to setEctsPdfUploadKey");
      }
      const data = await response.json();
      return data;
    } catch (e) {
      log.error(e);
    }
  });
}

export async function deleteFile(url: string) {
  log.context("ectsDeleteFile", { url });
  return log.timespan("ectsDeleteFile", async () => {
    try {
      const result = await fetch(api.deleteEctsFile, {
        method: "DELETE",
        body: JSON.stringify({ url }),
      });

      if (!result.ok) {
        toast.error("something_went_wrong", {
          description: "ects_settings.section.delete_file.error",
        });

        throw new Error("Unable to delete ECTS file");
      }

      toast.success("Success", {
        description: "ects_settings.section.delete_file.success",
      });
    } catch (e) {
      log.error(e);
    }
  });
}
