import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useTranslation } from "react-i18next";
import { replaceVariablesInString } from "@/src/client-functions/client-utils";
import { Badge } from "@/src/components/reusable/shadcn-ui/badge";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/reusable/shadcn-ui/popover";
import { Separator } from "@/src/components/reusable/shadcn-ui/separator";
import type { LayerUserFilter } from "@/src/types/user-management.types";
import { defaultFilter } from "@/src/types/user-management.types";
import useUserLayerManagement from "../../zustand";
import FilterSectionAccessLevel from "./access-type-filter-section";
import FilterSectionRole from "./role-filter-section";
import FilterSectionAccessStatus from "./status-filter-section";

export function LayerUserManagementFilter() {
  const { filter, submittedFilter, setSubmittedFilter, setFilter } =
    useUserLayerManagement();
  const { t } = useTranslation("page");

  const filterCount =
    filter.allowedRoles.length +
    filter.allowedAccessStates.length +
    filter.allowedAccessLevels.length;

  const allSelectedFilter: LayerUserFilter = {
    allowedRoles: ["moderator", "educator", "member"],
    allowedAccessLevels: ["access", "parent-access", "partial-access"],
    allowedAccessStates: ["active", "inactive"],
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          variant={"outline"}
          className="flex items-center border-dashed border-muted bg-transparent font-medium text-muted-contrast hover:bg-accent/50 focus:ring-0"
        >
          <PlusCircledIcon className="mr-2 h-4 w-4" />
          {t("filter")}
          {filter !== defaultFilter && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="default"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {filterCount}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                <Badge
                  variant="default"
                  className="rounded-sm px-1 font-normal"
                >
                  {replaceVariablesInString(t("x_applied"), [filterCount])}
                </Badge>
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="grid w-[700px] grid-cols-2 gap-4">
        <div className="flex h-full w-full items-start gap-4">
          <FilterSectionAccessLevel />
          <Separator orientation="vertical" />
        </div>
        <div className=" flex flex-col gap-4">
          <FilterSectionRole />
          <FilterSectionAccessStatus />
        </div>
        <div className="col-span-2 flex items-center justify-between gap-2">
          <Button
            disabled={
              JSON.stringify(filter) === JSON.stringify(allSelectedFilter)
            }
            onClick={() => {
              setFilter(allSelectedFilter);
            }}
          >
            {t("select_all")}
          </Button>
          <div className="flex items-center justify-end gap-2">
            <Button
              onClick={() => {
                setFilter(defaultFilter);
                setSubmittedFilter(defaultFilter);
              }}
            >
              {t("clear_filter")}
            </Button>
            <Button
              variant={"cta"}
              disabled={filter === submittedFilter}
              onClick={() => {
                setSubmittedFilter(filter);
              }}
            >
              {t("apply")}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
