import { useTranslation } from "react-i18next";
import { createScheduleCustomFilter } from "@/src/client-functions/client-schedule-filter";
import { PopoverStringInput } from "@/src/components/reusable/popover-string-input";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import useScheduleFilter from "../../zustand-filter";

export default function SaveFiltersButtons(props: {
  newFilters: boolean;
  filtersSelected: string[];
}) {
  const { setHaveNewCustomFilter } = useScheduleFilter();
  const { t } = useTranslation("page");

  return (
    <>
      {props.newFilters && props.filtersSelected.length > 0 && (
        <div className="flex w-full justify-center p-2">
          <PopoverStringInput
            className="w-full"
            actionName="general.create"
            onSubmit={async (name) => {
              await createScheduleCustomFilter(
                props.filtersSelected,
                name,
              ).then(() => {
                setHaveNewCustomFilter(true);
              });
            }}
          >
            <Button className="w-full" variant={"outline"}>
              <span className="text-contrast">
                {t("schedule_custom_filter_save_filter")}
              </span>
            </Button>
          </PopoverStringInput>
        </div>
      )}
    </>
  );
}
