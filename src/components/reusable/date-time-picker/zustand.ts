import { create } from "zustand";

export type DateTimePicker = {
  value: Date;
  setValue: any;
};

const initialState = {
  value: new Date(),
};

export const useDateTimePicker = create<DateTimePicker>((set) => ({
  ...initialState,
  setValue: (value) => set({ value }),
}));
