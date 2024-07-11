import { X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDebounce } from "@/src/client-functions/client-utils/hooks";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { Input } from "@/src/components/reusable/shadcn-ui/input";
import { useSelectMenuUserFilter } from "../../select-menu/zustand";
import { useInstitutionUserManagement } from "../../zustand";
import Create from "../create";
import Export from "../export";
import { GroupFilter } from "./filters/group-filter";
import { AccessFilter } from "./filters/layer-filter";
import useInstitutionUserManagementFilter from "./filters/zustand";
import ImportUsersTrigger from "./import-users/trigger";
import LearnUserManagement from "./learn-menu";
import { Options } from "./selected-options/actions-menu";
import { AddToGroup } from "./selected-options/add-to-group";
import { CreateGroupChat } from "./selected-options/create-group-chat";
import { EctsExport } from "./selected-options/ects-export";
import { GiveAccessTo } from "./selected-options/give-access-to";

export function DataTableToolbar() {
  const { table } = useInstitutionUserManagement();
  const { t } = useTranslation("page");
  const [inputVal, setInputVal] = useState("");

  const { filteredUserIds } = useSelectMenuUserFilter();

  const [filteredLayers, filterGroups, clearFilters, setSearch] =
    useInstitutionUserManagementFilter((state) => [
      state.filteredLayers,
      state.filterGroups,
      state.clearFilters,
      state.setSearch,
    ]);

  useDebounce(
    () => {
      setSearch(inputVal);
    },
    [inputVal],
    400,
  );

  if (!table) return null;

  const hasSelectedRows = !!filteredUserIds.length;

  return (
    <div className="flex w-full flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={t("general.search")}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          className="h-8 w-[150px] lg:w-[300px]"
        />
        <GroupFilter title={t("group")} />
        <AccessFilter title={t("access")} />
        {(filteredLayers.length > 0 || filterGroups.length > 0) && (
          <Button
            className="border-0 text-contrast hover:bg-accent"
            onClick={clearFilters}
          >
            <X className="mr-1 size-4" />
            {t("reset")}
          </Button>
        )}
      </div>
      <div className="flex flex-1 justify-end space-x-2 lg:flex lg:flex-row lg:flex-nowrap lg:space-x-2">
        {hasSelectedRows ? (
          <div className="hidden space-x-2 lg:flex xl:space-x-2">
            <GiveAccessTo />
            <AddToGroup />
            <Export />
            <EctsExport />
            <CreateGroupChat />
            <Options table={table} />
          </div>
        ) : (
          <div className="hidden space-x-2 lg:flex xl:space-x-2">
            <LearnUserManagement />
            <ImportUsersTrigger />
            <Create />
          </div>
        )}
      </div>
    </div>
  );
}
