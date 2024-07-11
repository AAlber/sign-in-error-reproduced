import type { RatingSchema } from "@prisma/client";
import { create } from "zustand";

interface RatingSchemaTable {
  schemas: RatingSchema[];
  setSchemas: (schemas: RatingSchema[]) => void;
}

const initalState = {
  schemas: [],
};

const useRatingSchemaTable = create<RatingSchemaTable>()((set) => ({
  ...initalState,
  setSchemas: (schemas) => set({ schemas }),
}));

export default useRatingSchemaTable;
