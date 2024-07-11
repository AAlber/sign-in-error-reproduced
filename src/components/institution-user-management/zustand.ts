import type { InstitutionUserDataField } from "@prisma/client";
import type { Table } from "@tanstack/react-table";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";
import type { InstitutionUserManagementUser } from "@/src/types/user-management.types";

export type InstitutionUserManagement = {
  refresh: number;
  users: InstitutionUserManagementUser[];
  dataFields: InstitutionUserDataField[];
  table: Table<any> | null;
  refreshList: () => void;
  setTable: (table: Table<any>) => void;
  setUsers: (users: InstitutionUserManagementUser[]) => void;
  setDataFields: (fields: InstitutionUserDataField[]) => void;
};

export const useInstitutionUserManagement =
  createWithEqualityFn<InstitutionUserManagement>()(
    (set) => ({
      refresh: 0,
      users: [],
      currentPage: 0,
      pageSize: 20,
      dataFields: [],
      table: null,
      setTable: (table) => set({ table }),
      refreshList: () => set({ refresh: Math.random() }),
      setUsers: (users) => set({ users }),
      setDataFields: (fields) => set({ dataFields: fields }),
    }),
    shallow,
  );
