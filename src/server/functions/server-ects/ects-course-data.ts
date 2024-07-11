import type {
  EctsExportDataWithUserData,
  ECTsStructureGrouped,
  ECTsTableItem,
} from "@/src/types/ects.types";
import { HttpError } from "@/src/utils/exceptions/http-error";
import { log } from "@/src/utils/logger/logger";
import { getLayers, getSimpleLayer } from "../server-administration";
import {
  getCourseGoalByLayerId,
  getCourseGoalContentBlocksByLayerId,
  getUserAttendenceAndGoalStatus,
} from "../server-course-goals";
import { getCoursesUserHasAccessTo, getUser } from "../server-user";
import { filterUniqueBy } from "../server-utils";
import { populateDataToExport } from "./common-utils";

export function determinePassStatus(
  overwrittenStatus: OverwriteCourseUserStatus | null,
  tableObject: ECTsTableItem,
) {
  if (overwrittenStatus) {
    return overwrittenStatus.passed;
  }
  const hasMetAttendanceGoal =
    tableObject.attendancePercentage >= tableObject.attendancePercentageGoal;

  const hasPassedAllPrerequisites =
    tableObject.passedPrerequisitesCount === tableObject.prerequisitesCount;
  return hasMetAttendanceGoal && hasPassedAllPrerequisites;
}

export function determineTableStatus(
  passed: boolean,
  layerNotStarted: boolean,
  layerOver: boolean,
  overwrittenStatus: OverwriteCourseUserStatus | null,
) {
  let status: "passed" | "failed" | "not-started" | "in-progress" =
    "not-started";

  switch (true) {
    case !layerNotStarted && !layerOver:
      status = "in-progress";
      break;
    case passed:
      status = "passed";
      break;
    case layerNotStarted:
      status = "not-started";
      break;
    case layerOver:
      status = "failed";
      break;
    case !!overwrittenStatus: {
      status = overwrittenStatus?.passed ? "passed" : "failed";
      break;
    }
  }
  return status;
}

export async function fillWithData(
  userId: string,
  markFailedCoursesAsInProgress: boolean,
  tableObject: ECTsTableItem,
) {
  const goal = await getCourseGoalByLayerId({
    layerId: tableObject.layer_id,
  });

  const goalsBlock = await getCourseGoalContentBlocksByLayerId({
    layerId: tableObject.layer_id,
  });

  const layer = await getSimpleLayer(tableObject.layer_id);
  if (!layer) throw new Error("Layer not found");

  const layerNotStarted = layer.start
    ? layer.start.getTime() > new Date().getTime()
    : false;

  const layerOver = layer.end
    ? layer.end.getTime() < new Date().getTime()
    : false;

  const status = await getUserAttendenceAndGoalStatus(
    tableObject.layer_id,
    userId,
    goal,
    goalsBlock,
  );

  tableObject.attendancePercentageGoal = goal.attendanceGoal;
  tableObject.prerequisitesCount = goalsBlock.length;
  tableObject.attendancePercentage =
    status.attendence.percentage === -1 ? 0 : status.attendence.percentage;
  tableObject.passedPrerequisitesCount = status.goalStatus.filter(
    (block) => block.status === "passed",
  ).length;

  const passed = determinePassStatus(status.overwrittenStatus, tableObject);
  tableObject.points = passed ? goal.points : 0;
  tableObject.status = determineTableStatus(
    passed,
    layerNotStarted,
    layerOver,
    status.overwrittenStatus,
  );

  if (markFailedCoursesAsInProgress) {
    tableObject.status =
      // this case can only happen if overwrittenStatus?.passed === false
      tableObject.status === "failed" && !layerOver
        ? "in-progress"
        : tableObject.status;
  }
}

export async function groupCoursesByParentLayer(
  courses: ECTsTableItem[],
): Promise<ECTsStructureGrouped> {
  log.context("ECTS - groupCoursesByParentLayer", courses);
  log.info("Grouping courses by parentLayer");

  const layers = await getLayers(courses.map((course) => course.layer_id));

  const onlyUniqueLayers = filterUniqueBy(layers, "id");

  const parentLayers = await getLayers(
    onlyUniqueLayers.map((layer) => layer.parent_id!),
  );

  const onlyUniqueParentLayers = filterUniqueBy(parentLayers, "id");

  return {
    type: "grouped",
    tableObjectGroups: onlyUniqueParentLayers.map((layer) => {
      const coursesInLayer = courses.filter(
        (course) =>
          parentLayers.find(
            (pl) =>
              pl.id ===
              onlyUniqueLayers.find((ul) => ul.id === course.layer_id)
                ?.parent_id,
          )?.id === layer.id,
      );
      return {
        name: layer.name,
        tableObjects: coursesInLayer,
      };
    }),
  };
}

export async function getEctsDataOfUser(
  userId: string,
  type: "flat" | "grouped",
  markCoursesAsInProgress: boolean,
): Promise<EctsExportDataWithUserData> {
  const user = await getUser(userId);
  if (!user) throw new HttpError(`userId: ${userId} not found"`, 400);

  const courses = (await getCoursesUserHasAccessTo(
    userId,
  )) as unknown as ECTsTableItem[];

  const commonArgs = {
    userId,
    language: user.language,
  };

  if (type === "grouped") {
    const groupedCourses = await groupCoursesByParentLayer(courses);
    const populatedDataGrouped = await populateDataToExport(
      { ...commonArgs, ...groupedCourses },
      markCoursesAsInProgress,
    );

    return { user, ...populatedDataGrouped };
  }

  const populatedDataFlat = await populateDataToExport(
    { ...commonArgs, type, tableObjects: courses },
    markCoursesAsInProgress,
  );

  return { user, ...populatedDataFlat };
}
