import { t } from "i18next";
import { FileBadgeIcon } from "lucide-react";
import React from "react";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import ExportPreferencesPopover from "@/src/components/reusable/user-overview-sheet/user-overview-content/user-overview-tables/user-ects-export-table/export-preferences-popover";
import WithToolTip from "@/src/components/reusable/with-tooltip";
import useUser from "@/src/zustand/user";

export function EctsExport() {
  const { user } = useUser();

  if (!user.institution?.institutionSettings.addon_ects_points) return null;

  return (
    <ExportPreferencesPopover>
      <WithToolTip delay={300} text={t("ECTS")}>
        <Button size={"icon"} variant="ghost">
          <FileBadgeIcon className="h-4 w-4" />
        </Button>
      </WithToolTip>
    </ExportPreferencesPopover>
  );
}
