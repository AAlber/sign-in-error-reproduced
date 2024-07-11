import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpRight } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { getAllUsersOfInstitution } from "@/src/client-functions/client-user-management";
import type { InstitutionUserManagementUser } from "@/src/types/user-management.types";
import TruncateHover from "../reusable/truncate-hover";
import { UserOverviewTrigger } from "../reusable/user-overview-sheet/user-overview-trigger";
import { UserStatusSelector } from "../reusable/user-status-indicator";
import UserDefaultImage from "../user-default-image";
import { DataTable } from "./data-table";
import TableLoader from "./data-table/table-loader";
import useInstitutionUserManagementFilter from "./data-table/toolbar/filters/zustand";
import UserCustomField from "./data-table/user-custom-field";
import {
  QUERY_KEY_USERS_OF_INSTITUTION,
  type UserManagementDataFields,
} from "./data-table/user-custom-field/types";
import UserRowCell from "./data-table/user-row-cell";
import { MINIMUM_COL_SIZE, useTableColumn } from "./data-table/zustand";
import TableSelectMenu from "./select-menu";
import { SelectCell } from "./select-menu/cell";
import { useInstitutionUserManagement } from "./zustand";

export default function InstitutionUserManagement() {
  const {
    filterGroups,
    filteredLayers,
    pageSize,
    pageNumber,
    search,
    setTotalPages,
  } = useInstitutionUserManagementFilter();

  const [dataFields, refreshCount, users, setDataFields, setUsers] =
    useInstitutionUserManagement((state) => [
      state.dataFields,
      state.refresh,
      state.users,
      state.setDataFields,
      state.setUsers,
    ]);

  const form = useForm<UserManagementDataFields>();
  const { t } = useTranslation("page");

  const columnSize = useTableColumn((state) => state.tableColumnSize);
  const columns: ColumnDef<InstitutionUserManagementUser>[] = [
    {
      id: "select",
      maxSize: 50,
      header: ({ table }) => (
        <div className="ml-2 flex w-8 items-center justify-start">
          <TableSelectMenu table={table} />
        </div>
      ),
      cell: ({ row }) => <SelectCell userId={row.original.id} />,
      enableResizing: false,
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "name",
      accessorKey: "name",
      size: columnSize["--col-name-size"],
      header: () => t("name"),
      cell: ({ row }) => {
        return (
          <UserOverviewTrigger user={row.original}>
            <div className="group relative flex w-auto cursor-pointer items-center justify-between overflow-hidden text-clip hover:underline">
              <div className="flex w-auto items-center gap-2 truncate hover:opacity-80">
                <div className="h-5 w-5">
                  <UserDefaultImage user={row.original} dimensions="h-5 w-5" />
                </div>
                <span className="truncate">{row.original.name}</span>
              </div>
              <ArrowUpRight className="absolute right-0 hidden h-5 w-5 text-primary group-hover:flex" />
            </div>
          </UserOverviewTrigger>
        );
      },
    },
    UserRowCell({
      id: "email",
      header: "user_management.table_header_email",
      columnSize: columnSize["--col-email-size"] ?? MINIMUM_COL_SIZE,
      cell: ({ row }) => {
        return <TruncateHover text={row.original.email} truncateAt={100} />;
      },
    }),
    {
      accessorKey: "status",
      size: columnSize["--col-status-size"],
      header: () => {
        return <div className="flex w-auto items-center">{t("status")}</div>;
      },
      cell: ({ row }) => {
        return (
          <div className="w-full text-clip">
            <UserStatusSelector user={row.original} />
          </div>
        );
      },
    },
    ...dataFields.map((dataField) => {
      return UserCustomField({
        id: dataField.id,
        header: dataField.name,
        columnSize: columnSize[`--col-${dataField.id}-size`] ?? 200,
      });
    }),
  ];

  const { data, isLoading } = useQuery({
    queryFn: () =>
      getAllUsersOfInstitution({
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
        groupIds: filterGroups.map((g) => g.id).join(","),
        layerIds: filteredLayers.map((l) => l.id).join(","),
        search,
      }),
    queryKey: [
      ...QUERY_KEY_USERS_OF_INSTITUTION,
      {
        pageNumber,
        pageSize,
        search,
        groupIds: filterGroups.map(({ id }) => id).join(","),
        layerIds: filteredLayers.map(({ id }) => id).join(","),
        refreshCount,
      },
    ],
    staleTime: 60000 * 5,
    refetchOnWindowFocus: false,
    onSuccess(data) {
      if (!data) return;
      setDataFields(data.dataFields);
      setTotalPages(data.total ?? 1);

      // Source of truth is from ZUSTAND
      setUsers(data.users);
    },
  });

  useEffect(() => {
    if (data?.users && data.dataFields) {
      // set initial value of each dataField cell
      const initialValue: UserManagementDataFields = {};
      data.dataFields.forEach((field) => {
        data.users.forEach((user) => {
          const exists = user.fieldData.find((i) => i.fieldId === field.id);
          initialValue[`${field.id}__${user.id}`] = exists?.value ?? "";
        });
      });
      form.reset(initialValue);
      setUsers(data.users);
    }
  }, [data]);

  if (!data || isLoading) return <TableLoader />;
  return (
    <FormProvider {...form}>
      <DataTable columns={columns} data={users} />
      <UserSheet />
    </FormProvider>
  );
}

const UserSheet = dynamic(() => import("../reusable/user-overview-sheet"));
