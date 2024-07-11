import { Filter, UserRoundX } from "lucide-react";
import { getUserGroupsOfInstitution } from "@/src/client-functions/client-institution-user-groups";
import AsyncSelect from "@/src/components/reusable/async-select";
import { EmptyState } from "@/src/components/reusable/empty-state/empty-state";
import { Badge } from "@/src/components/reusable/shadcn-ui/badge";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { Separator } from "@/src/components/reusable/shadcn-ui/separator";
import TruncateHover from "@/src/components/reusable/truncate-hover";
import useInstitutionUserManagementFilter from "./zustand";

interface DataTableGroupFilterProps {
  title?: string;
}

export function GroupFilter({ title }: DataTableGroupFilterProps) {
  const { filterGroups, setFilterGroups } =
    useInstitutionUserManagementFilter();

  return (
    <AsyncSelect
      side="bottom"
      trigger={
        <Button
          variant="outline"
          size="small"
          className=" h-8 border-dashed text-contrast"
        >
          <Filter className=" mr-2 h-4 w-4 text-muted-contrast" />
          {title}
          {filterGroups.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="default"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {filterGroups.length}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {filterGroups.length > 2 ? (
                  <Badge
                    variant="default"
                    className="rounded-sm bg-accent px-1 font-normal"
                  >
                    {filterGroups.length} selected
                  </Badge>
                ) : (
                  filterGroups
                    .filter((option) => filterGroups.includes(option))
                    .map((option) => (
                      <Badge
                        variant="default"
                        key={option.id}
                        className="rounded-sm border border-accent bg-accent px-1 font-normal hover:border-accent"
                      >
                        {option.name}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      }
      emptyState={
        <EmptyState
          className="p-2"
          icon={UserRoundX}
          title="user.groups.empty.title"
          description="user.management.groups.empty.description"
        />
      }
      openWithShortcut={false}
      placeholder="general.search"
      noDataMessage="general.empty"
      fetchData={() => getUserGroupsOfInstitution("")}
      filter={(group) => !filterGroups.includes(group)}
      onSelect={(item) => {
        const groupIdx = filterGroups.findIndex(
          (group) => group.id === item.id,
        );

        if (groupIdx === -1) setFilterGroups([...filterGroups, item]);
        else {
          const clone = [...filterGroups];
          clone.splice(groupIdx, 1);
          setFilterGroups(clone);
        }
      }}
      searchValue={(item) => item.name + " " + item.id}
      itemComponent={(item) => (
        <div className="flex w-full items-center justify-between">
          <p className="flex w-full items-center gap-2">
            <TruncateHover
              text={item.name ?? ""}
              truncateAt={39}
              side="right"
            />
          </p>
        </div>
      )}
    />
  );
}
