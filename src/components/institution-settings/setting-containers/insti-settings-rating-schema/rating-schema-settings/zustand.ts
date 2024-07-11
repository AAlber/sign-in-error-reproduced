import type { RatingSchema, RatingSchemaValue } from "@prisma/client";
import { create } from "zustand";

interface RatingSchemaSettings {
  open: boolean;
  schema: RatingSchema | null;
  values: RatingSchemaValue[];
  setValues: (values: RatingSchemaValue[]) => void;
  setOpen: (open: boolean) => void;
  setSchema: (schema: RatingSchema) => void;
  init: (schema: RatingSchema) => void;
}

const initalState = {
  schema: null,
  values: [],
  open: false,
};

const useRatingSchemaSettings = create<RatingSchemaSettings>()((set) => ({
  ...initalState,
  ratingSchemaId: "",
  setValues: (values) => set({ values }),
  setOpen: (open) => set({ open }),
  init: (schema) => set({ schema, open: true }),
  setSchema: (schema) => set({ schema }),
}));

export default useRatingSchemaSettings;
