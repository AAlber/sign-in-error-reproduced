import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import Tick from "@/src/components/reusable/settings-ticks/tick";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import type { CustomScheduleFilter } from "@/src/types/appointment.types";
import useScheduleFilter from "../../../zustand-filter";
import DeleteFilterButton from "./delete-button";

export default function CustomFilterButton(props: {
  filter: CustomScheduleFilter;
}) {
  const {
    customFilters,
    setFilteredLayers,
    setCustomFilters,
    setOnlyOrganizedByMe,
  } = useScheduleFilter();
  const { t } = useTranslation("page");

  function onFilterChange(layerIds: string[], checked: boolean) {
    if (checked) {
      setFilteredLayers(layerIds);
    } else {
      setFilteredLayers([]);
    }
  }

  function setFilter(filter: CustomScheduleFilter, checked: boolean) {
    setCustomFilters(
      customFilters.map((f) => {
        if (f.layerIds === filter.layerIds) {
          return { ...f, checked };
        }
        return { ...f, checked: false };
      }),
    );
  }

  const { filter } = props;

  const handleClick = () => {
    setOnlyOrganizedByMe(false);
    const updatedChecked = !filter.checked;
    setFilter(filter, updatedChecked);
    onFilterChange(filter.layerIds!, updatedChecked);
  };
  const handleTick = (checked: boolean) => {
    setOnlyOrganizedByMe(false);
    setFilter(filter, checked);
    onFilterChange(filter.layerIds!, checked);
  };
  return (
    <StandaloneCustomFilterButton
      handleClick={handleClick}
      handleTick={handleTick}
      checked={filter.checked}
      filterName={filter.name}
      filterId={filter.id}
    >
      {filter.checked && (
        <span className="ml-auto text-xs font-normal text-muted-contrast group-hover:hidden">
          {filter.layerIds?.length} {t("schedule_custom_filter_selections")}
        </span>
      )}
    </StandaloneCustomFilterButton>
  );
}

type Props = {
  handleClick: () => void;
  handleTick: (checked: boolean) => void;
  checked: boolean;
  filterName: string;
  filterId?: string;
  children?: ReactNode;
};

export const StandaloneCustomFilterButton = ({
  handleClick,
  handleTick,
  checked,
  filterId,
  filterName,
  children,
}: Props) => {
  return (
    <Button
      className="group flex w-full justify-start gap-4"
      onClick={handleClick}
    >
      <Tick checked={checked} onChange={handleTick} />
      <span>{filterName}</span>
      {children}
      {filterId && <DeleteFilterButton id={filterId} />}
    </Button>
  );
};
