import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import useSchedule from "../../../zustand";
import useScheduleFilter from "../../../zustand-filter";
import { RoomFilter } from "../../room-filter";
import CustomFilterButton from "./item-button";
import OrganizedByMeFilterButton from "./organized-by-me-filter-button";

export default function CustomFilters() {
  const { refreshAppointments } = useSchedule();
  const {
    customFilters,
    setFiltersChanged,
    filteredLayers,
    setCustomFilters,
    customFilterLoading,
    onlyOrganizedByMe,
    filteredRoom,
    clearFilters,
  } = useScheduleFilter();

  const { t } = useTranslation("page");

  useEffect(() => {
    if (customFilters.find((filter) => filter.checked)) {
      setFiltersChanged(false);
    } else {
      setFiltersChanged(true);
    }

    if (
      !customFilters.map((filter) => filter.layerIds).includes(filteredLayers)
    ) {
      setCustomFilters(
        customFilters.map((f) => {
          if (f.layerIds === filteredLayers) {
            return { ...f, checked: true };
          }
          return { ...f, checked: false };
        }),
      );
      setFiltersChanged(true);
    }
  }, [filteredLayers]);

  const isAnyFilterActive =
    customFilters.some((filter) => filter.checked) ||
    filteredLayers.length > 0 ||
    onlyOrganizedByMe ||
    filteredRoom !== undefined;

  return (
    <div className="flex max-h-[340px] w-[300px] flex-col overflow-y-auto overflow-x-hidden p-4">
      <div className="flex items-start justify-between">
        <h1 className="text-contrast">{t("filters")}</h1>
        {isAnyFilterActive && (
          <Button
            variant={"link"}
            size="button"
            onClick={() => {
              clearFilters();
              refreshAppointments();
            }}
          >
            {t("reset")}
          </Button>
        )}
      </div>
      <div className="mb-6 mt-4 flex flex-col gap-2">
        <OrganizedByMeFilterButton />
        <RoomFilter />
      </div>
      <h1 className="w-full text-start text-contrast">
        {t("schedule_custom_filter_title")}
      </h1>
      {!customFilterLoading && customFilters.length === 0 && (
        <p className="mt-1 text-sm text-muted-contrast">
          {t("no_custom_filter_set")}
        </p>
      )}

      {!customFilterLoading ? (
        <div className="mt-4 flex flex-col gap-2">
          {customFilters.map((filter) => (
            <CustomFilterButton key={filter.name} filter={filter} />
          ))}
        </div>
      ) : (
        <div className="flex w-full items-center justify-center">
          {t("general.loading")}
        </div>
      )}
    </div>
  );
}
