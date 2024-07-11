import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  getDataForEctsExport,
  getManyUsersDataForEctsExport,
} from "@/src/client-functions/client-ects";
import { useSelectMenuUserFilter } from "@/src/components/institution-user-management/select-menu/zustand";
import { useInstitutionUserManagement } from "@/src/components/institution-user-management/zustand";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import WithToolTip from "@/src/components/reusable/with-tooltip";
import type { EctsExportData } from "@/src/types/ects.types";
import useECTsExport from "./zustand";

export default function ExportAs(props: ExportAsProps) {
  const selectedCourseIds = useECTsExport((state) => state.selectedCourseIds);
  const selectedUserIds = useSelectMenuUserFilter(
    (state) => state.filteredUserIds,
  );

  const { t } = useTranslation("page");

  const { isLoading, mutateAsync } = useMutation({
    mutationFn: async (format: "csv" | "pdf" | "zip") => {
      if (!props.exportData) {
        /**
         * no exportData means that this is coming from userManagement
         * which means we export all courses data of the selectedUsers
         */
        await getManyUsersDataForEctsExport(selectedUserIds, format);
        return;
      }

      const users = useInstitutionUserManagement.getState().users;
      const filename =
        users.find((u) => props.exportData.userId === u.id)?.name ??
        "ects-export";

      await getDataForEctsExport(props.exportData, filename, format);
    },
  });

  const disabled =
    isLoading ||
    (props.exportData ? !selectedCourseIds.length : !selectedUserIds.length);

  return (
    <>
      <div className="flex-1">
        <WithToolTip text={t("no_data_tooltip")} disabled={!disabled}>
          <Button
            disabled={disabled}
            variant="cta"
            className="w-full"
            onClick={() => mutateAsync("pdf")}
          >
            {t("export_pdf.button")}
          </Button>
        </WithToolTip>
      </div>
      <div className="flex w-full justify-between gap-4">
        <Button
          disabled={disabled}
          className="flex-1"
          variant="default"
          onClick={() => mutateAsync("csv")}
        >
          .csv
        </Button>
        <Button
          disabled={disabled}
          className="flex-1"
          variant="default"
          onClick={() => mutateAsync("zip")}
        >
          .zip
        </Button>
      </div>
    </>
  );
}

type A = {
  exportData?: undefined;
  fileName?: never;
};

type B = {
  exportData: EctsExportData;
  fileName: string;
};

export type ExportAsProps = A | B;
