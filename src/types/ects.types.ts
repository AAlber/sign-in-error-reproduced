import type { User } from "@prisma/client";
import type { SimpleCourse } from "./course.types";

export type GetEctsData = {
  userId: string;
  type: "grouped" | "flat";
  includeTimeConstrainingLayer: boolean;
};

export type ECTsTableItem = SimpleCourse & {
  role: Role;
  isTitle: boolean;
  timeConstrainingLayer: string;
  points: number;
  attendancePercentageGoal: number;
  attendancePercentage: number;
  prerequisitesCount: number;
  passedPrerequisitesCount: number;
  status: "not-started" | "in-progress" | "passed" | "failed";
};

export type ECTsStructureGrouped = {
  type: "grouped";
  tableObjectGroups: {
    name: string;
    tableObjects: ECTsTableItem[];
  }[];
};

export type ECTsStructureFlat = {
  type: "flat";
  tableObjects: ECTsTableItem[];
};

export type ECTsStructure = ECTsStructureGrouped | ECTsStructureFlat;

export type ECTsDataPoints = {
  attendance: boolean;
  prerequisites: boolean;
  points: boolean;
  status: boolean;
};

export type EctsExportData = ECTsStructure & {
  userId: string;
  language?: string;
};

export type EctsPdfUploads = {
  introductoryKey?: string;
  appendixKey?: string;
};

export type DownloadEctsPdf = "appendix" | "introductory";

export type GetEctsDataExportArgs = EctsExportData & {
  /** mark courses as `inProgress` if the layer is not yet over AND (only) if `OverwrittenStatus.passed === false` */
  markCoursesAsInProgress: boolean;
  dataPoints: ECTsDataPoints;
  format: EctsExportFormat;
};

export type GetEctsDataExportForManyArgs = Omit<
  GetEctsDataExportArgs,
  keyof EctsExportData
> & {
  userIds: string[];
  type: "flat" | "grouped";
};

export type EctsExportDataWithUserData = EctsExportData & {
  user: User;
};

export type EctsExportFormat = "csv" | "pdf" | "zip";
