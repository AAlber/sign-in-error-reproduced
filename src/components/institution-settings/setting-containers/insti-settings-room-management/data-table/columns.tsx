import { User } from "lucide-react";
import { Checkbox } from "@/src/components/reusable/shadcn-ui/checkbox";
import TableHeaderElement from "@/src/components/reusable/table-header";
import { useInstitutionRoomList } from "../zustand";
import RoomMenu from "./room-menu";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Room = {
  id: string;
  name: string;
  personCapacity: number;
  address: string;
};

export const useColumns = () => {
  const { setSelectedRows, selectedRows, rooms } = useInstitutionRoomList();

  return [
    {
      id: "select",
      header: () => {
        return (
          <Checkbox
            checked={selectedRows.length === rooms.length}
            onCheckedChange={(value) => {
              if (value) {
                setSelectedRows(rooms);
              } else {
                setSelectedRows([]);
              }
            }}
            aria-label="Select all"
            className="relative -left-2 ml-2"
          />
        );
      },
      cell: ({ row }) => {
        return (
          <Checkbox
            checked={selectedRows.includes(row.original)}
            onCheckedChange={(value) => {
              if (value) {
                setSelectedRows([...selectedRows, row.original]);
              } else {
                setSelectedRows(
                  selectedRows.filter((r) => r.id !== row.original.id),
                );
              }
            }}
            aria-label="Select row"
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "name",
      accessorKey: "name",
      accessorFn: (row) => row.name,
      header: ({ table }) => {
        return (
          <div className="flex items-center gap-4">
            <TableHeaderElement
              text="organization_settings.room_management_table_header_name"
              onClick={() => table.toggleAllRowsExpanded()}
              className="cursor-pointer"
            />
          </div>
        );
      },
    },
    {
      id: "capacity",
      accessorKey: "personCapacity",
      accessorFn: (row) => row.personCapacity,
      header: ({ table }) => {
        return (
          <div className="flex items-center gap-4">
            <TableHeaderElement
              text="organization_settings.room_management_table_header_capacity"
              onClick={() => table.toggleAllRowsExpanded()}
              className="cursor-pointer"
            />
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <User size={16} />
            <span className="font-medium">
              {row.original.personCapacity === 100
                ? "100+"
                : row.original.personCapacity}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "address",
      accessorFn: (row) => row.address,
      header: ({ table }) => {
        return (
          <div className="flex items-center gap-4">
            <TableHeaderElement
              text="organization_settings.room_management_table_header_address"
              onClick={() => table.toggleAllRowsExpanded()}
              className="cursor-pointer"
            />
          </div>
        );
      },
    },
    {
      accessorKey: "menu",
      accessorFn: (row) => row,
      header: "",
      cell: ({ row }) => {
        return (
          <div className="">
            <RoomMenu room={row.original} />
          </div>
        );
      },
    },
  ];
};
