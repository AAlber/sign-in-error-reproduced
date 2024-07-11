import React from "react";
import { useTranslation } from "react-i18next";
import { log } from "@/src/utils/logger/logger";
import { Button } from "../shadcn-ui/button";
import WithToolTip from "../with-tooltip";
import type { UserCSVData } from "./export-user-data";
import exportUserData from "./export-user-data";

type Props<T> = {
  data: UserCSVData<T>[];
  fileBaseName: string;
  fileSuffixName?: string;
};

export default function ExportCsvButton<T extends Record<string, any>>({
  data,
  fileBaseName,
  fileSuffixName,
}: Props<T>) {
  const { t } = useTranslation("page");

  const handleExport = () => {
    log.click("User clicked the export CSV button");
    exportUserData(data, fileBaseName, fileSuffixName);
  };

  return (
    <WithToolTip text={t("no_data_tooltip")} disabled={data.length > 0}>
      <Button onClick={handleExport} disabled={data.length === 0}>
        {t("export_csv.button")}
      </Button>
    </WithToolTip>
  );
}
