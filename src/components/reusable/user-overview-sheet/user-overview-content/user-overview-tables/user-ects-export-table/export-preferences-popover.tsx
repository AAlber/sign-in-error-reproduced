import { useQuery } from "@tanstack/react-query";
import { type PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import { getCoursesForEctsExport } from "@/src/client-functions/client-ects";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/reusable/shadcn-ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/reusable/shadcn-ui/popover";
import { log } from "@/src/utils/logger/logger";
import ExportPreferencesContent from "./export-preferences-content";
import useECTsExport from "./zustand";

type Props = {
  forUserId?: string;
};

export default function ExportPreferencesPopover({
  forUserId,
  children,
}: PropsWithChildren<Props>) {
  const { exportStructure } = useECTsExport();
  const { t } = useTranslation("page");

  const { data } = useQuery(["export-data", exportStructure, forUserId], {
    enabled: !!forUserId,
    queryFn: () => {
      if (!forUserId) return;
      log.info("Fetching ECTS export data", { userId: forUserId });

      const currentState = useECTsExport.getState();
      return getCoursesForEctsExport({
        userId: forUserId,
        type: currentState.exportStructure,
        includeTimeConstrainingLayer: currentState.includeTimeConstrainingLayer,
      });
    },
    onSettled(data) {
      if (forUserId && !data) {
        log.warn("No ECTS data loaded", { userId: forUserId });
      }
    },
  });

  return (
    <Popover>
      <PopoverTrigger disabled={!!forUserId && !data}>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-[350px]" align="end">
        <CardHeader className="px-0 pb-4 pt-0">
          <CardTitle>{t("ects_export.export_preferences")}</CardTitle>
          <CardDescription>
            {t("ects_export.export_preferences_description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 p-0">
          <ExportPreferencesContent forUserId={forUserId} />
        </CardContent>
      </PopoverContent>
    </Popover>
  );
}
