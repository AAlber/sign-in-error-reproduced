import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  // keys are CSS vars ex. {"--header-name-size" : 200}
  tableColumnSize: { [columnSize: string]: number };
  setTableColumnSize: (data: State["tableColumnSize"]) => void;
};

export const useTableColumn = create<State>()(
  persist(
    (set) => ({
      tableColumnSize: {},
      setTableColumnSize: (data) =>
        set((state) => {
          const tableColumnSize = { ...state.tableColumnSize, ...data };
          return {
            tableColumnSize,
          };
        }),
    }),
    { name: "TableColumns" },
  ),
);

export const MINIMUM_COL_SIZE = 200;
