import type { Table } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { getAllUserIdsOfInstitution } from "@/src/client-functions/client-user-management";
import type { InstitutionUserManagementUser } from "@/src/types/user-management.types";
import { Checkbox } from "../../reusable/shadcn-ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../reusable/shadcn-ui/dropdown-menu";
import { useSelectMenuUserFilter } from "./zustand";

export default function TableSelectMenu({
  table,
}: {
  table: Table<InstitutionUserManagementUser>;
}) {
  const { t } = useTranslation("page");
  const { addUsersToFilter, emptyFilter, filteredUserIds } =
    useSelectMenuUserFilter();

  const usersFromCurrentPage = table
    .getCoreRowModel()
    .flatRows.map((row) => row.original.id);

  const hasSelectedRowsInCurrentPage = usersFromCurrentPage.every((id) =>
    filteredUserIds.includes(id),
  );

  const hasSomeUsersSelected = !!filteredUserIds.length;

  const handleSelectAllFromCurrentPage = () => {
    const ids = table.getCoreRowModel().flatRows.map((r) => r.original.id);
    addUsersToFilter(ids);
  };

  const handleSelectAllUsers = async () => {
    /**
     * Since userIds of all pages are not yet available as we need to navigate to that page first before fetching userIds,
     * We just do the following:
     * 1. first select all userIds from current page
     * 2. do an async fetch of all userIds of currentInstitution - then add the response to the selectedUsers zustand state
     */

    handleSelectAllFromCurrentPage();
    const userIdsOfInstitution = await getAllUserIdsOfInstitution();
    addUsersToFilter(userIdsOfInstitution);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Checkbox
          checked={hasSelectedRowsInCurrentPage}
          aria-label="Select all"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="[&>div]:cursor-pointer">
        <DropdownMenuItem onClick={handleSelectAllUsers}>
          {t("select_all_from_all_pages")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSelectAllFromCurrentPage}>
          {t("select_all_from_from_current_page")}
        </DropdownMenuItem>
        {hasSomeUsersSelected && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                emptyFilter();
              }}
            >
              {t("deselect-all")}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
