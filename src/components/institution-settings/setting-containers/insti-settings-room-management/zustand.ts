import type { InstitutionRoom } from "@prisma/client";
import { create } from "zustand";

export type InstitutionRoomList = {
  refresh: number;
  rooms: InstitutionRoom[];
  refreshRooms: () => void;
  setRooms: (rooms: InstitutionRoom[]) => void;
  selectedRows: InstitutionRoom[];
  setSelectedRows: (rooms: InstitutionRoom[]) => void;
};

export const useInstitutionRoomList = create<InstitutionRoomList>((set) => ({
  refresh: 0,
  rooms: [],
  refreshRooms: () => set({ refresh: Math.random() }),
  setRooms: (rooms) => set({ rooms }),
  selectedRows: [],
  setSelectedRows: (selectedRows) => set({ selectedRows }),
}));
