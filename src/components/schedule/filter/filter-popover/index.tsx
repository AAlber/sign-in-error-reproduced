import { cx } from "class-variance-authority";
import { useEffect } from "react";
import structureHandler from "@/src/client-functions/client-administration/structure-handler";
import { getScheduleCustomFilters } from "@/src/client-functions/client-schedule-filter";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/reusable/shadcn-ui/popover";
import type { CustomScheduleFilter } from "@/src/types/appointment.types";
import useScheduleFilter from "../../zustand-filter";
import CustomFilters from "./custom-filters";
import FilterComponent from "./filter-component";
import SaveFiltersButtons from "./save-button";

export default function FilterPopover({
  children,
}: {
  children?: React.ReactNode;
}) {
  const {
    modalOpen,
    setModalOpen,
    setFilteredLayers,
    filteredLayers,
    filtersChanged,
    setFiltersChanged,
    setCustomFilters,
    setCustomFilterLoading,
    customFilters,
    haveNewCustomFilter,
    setHaveNewCustomFilter,
    setOnlyOrganizedByMe,
  } = useScheduleFilter();

  async function fetchCustomFilters() {
    setCustomFilterLoading(true);
    await getScheduleCustomFilters().then((res: CustomScheduleFilter[]) => {
      setCustomFilters(res);
      setCustomFilterLoading(false);
      setHaveNewCustomFilter(false);
    });
  }

  useEffect(() => {
    fetchCustomFilters();
  }, [haveNewCustomFilter]);
  return (
    <Popover open={modalOpen} onOpenChange={setModalOpen}>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent
        className={cx(
          "p-0",
          customFilters && customFilters.length === 0 ? "w-auto" : "w-[600px]",
        )}
      >
        <div className={cx("grid  grid-cols-2 divide-x divide-border")}>
          <div className="w-full">
            <FilterComponent
              onMultiSelect={(layers) => {
                setOnlyOrganizedByMe(false);
                setFilteredLayers(layers);
                setFiltersChanged(true);
              }}
              fetchOptions={() =>
                structureHandler.get.layersUserHasSpecialAccessTo()
              }
              selectedOptions={filteredLayers}
            />
          </div>
          <CustomFilters />
        </div>
        <SaveFiltersButtons
          newFilters={filtersChanged}
          filtersSelected={filteredLayers}
        />
      </PopoverContent>
    </Popover>
  );
}
