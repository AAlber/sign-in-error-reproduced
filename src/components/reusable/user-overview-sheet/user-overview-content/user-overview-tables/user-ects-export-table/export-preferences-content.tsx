import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getCoursesForEctsExport } from "@/src/client-functions/client-ects";
import { Separator } from "@/src/components/reusable/shadcn-ui/separator";
import type { ExportAsProps } from "./export-as";
import ExportAs from "./export-as";
import ExportPreferenceSwitch from "./export-preference-switch";
import useECTsExport from "./zustand";

type Props = {
  forUserId?: string;
};

export default function ExportPreferencesContent({ forUserId }: Props) {
  const {
    includeTimeConstrainingLayer,
    markCoursesAsInProgress,
    exportStructure,
    attendance,
    points,
    prerequisites,
    status,
    setDataPointToExport,
    setExportStructure,
  } = useECTsExport();

  const { data } = useQuery(["export-data", exportStructure, forUserId], {
    enabled: !!forUserId,
    staleTime: 30 * 1000, // 30 secs
    queryFn: () => {
      if (!forUserId) return;
      const currentState = useECTsExport.getState();
      return getCoursesForEctsExport({
        userId: forUserId,
        type: currentState.exportStructure,
        includeTimeConstrainingLayer: currentState.includeTimeConstrainingLayer,
      });
    },
  });

  return (
    <>
      <ExportPreferenceSwitch
        label="ects_export.grouped"
        description="ects_export.grouped_description"
        checked={exportStructure === "grouped"}
        onChange={(value) => setExportStructure(value ? "grouped" : "flat")}
      />
      <ExportPreferenceSwitch
        label="ects_export.include_time_layer"
        description="ects_export.include_time_layer_description"
        checked={includeTimeConstrainingLayer}
        onChange={(val) =>
          setDataPointToExport({ includeTimeConstrainingLayer: val })
        }
      />
      <ExportPreferenceSwitch
        label="ects_export.mark_courses_in_progress.title"
        description="ects_export.mark_courses_in_progress.description"
        checked={markCoursesAsInProgress}
        onChange={(val) =>
          setDataPointToExport({ markCoursesAsInProgress: val })
        }
      />
      <Separator />
      <ExportPreferenceSwitch
        label="ects_pdf.header.attendance"
        checked={attendance}
        onChange={(val) => {
          setDataPointToExport({ attendance: val });
        }}
      />
      <ExportPreferenceSwitch
        label="ects_pdf.header.prerequisites"
        checked={prerequisites}
        onChange={(val) => {
          setDataPointToExport({ prerequisites: val });
        }}
      />
      <ExportPreferenceSwitch
        label="ects_pdf.header.points"
        checked={points}
        onChange={(val) => {
          setDataPointToExport({ points: val });
        }}
      />
      <ExportPreferenceSwitch
        label="ects_pdf.header.status"
        checked={status}
        onChange={(val) => {
          setDataPointToExport({ status: val });
        }}
      />
      <Separator />

      <ExportAs
        {...(data && forUserId
          ? { exportData: { ...data, userId: forUserId }, fileName: "" }
          : ({} as ExportAsProps))}
      />
    </>
  );
}
