import { Settings2 } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { log } from "@/src/utils/logger/logger";
import { Button } from "../../reusable/shadcn-ui/button";
import WithToolTip from "../../reusable/with-tooltip";
import useScheduleFilter from "../zustand-filter";
import FilterPopover from "./filter-popover";

export default function ScheduleFilter() {
  const { t } = useTranslation("page");
  const { filteredLayers, onlyOrganizedByMe, filteredRoom, modalOpen } =
    useScheduleFilter();
  const isFiltered =
    filteredLayers.length > 0 || onlyOrganizedByMe || filteredRoom;

  useEffect(() => {
    if (isFiltered) {
      log.context("Filtered schedule", {
        layers: filteredLayers,
        onlyOrganizedByMe: onlyOrganizedByMe,
        room: filteredRoom,
      });
    }
  }, [isFiltered]);

  return (
    <FilterPopover>
      <Button className="relative">
        {isFiltered && (
          <WithToolTip
            text={`${
              filteredLayers.length ||
              (onlyOrganizedByMe && 1) ||
              (filteredRoom && 1)
            } ${t("filter_index")}`}
            disabled={modalOpen}
          >
            <div className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-primary" />
          </WithToolTip>
        )}
        <Settings2 className="mr-1 h-4 w-4" />
        <span className="text-contrast">{t("filter")}</span>
      </Button>
    </FilterPopover>
  );
}
