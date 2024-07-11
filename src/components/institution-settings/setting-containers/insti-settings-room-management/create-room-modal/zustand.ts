import type { InstitutionRoom } from "@prisma/client";
import { create } from "zustand";

export type CreateRoomModal = {
  open: boolean;
  name: string;
  capacity: number;
  address: string;
  addressNotes: string;
  amenities: string[];
  editMode: boolean;
  roomId: string;
  setOpen: (open: boolean) => void;
  openRoomCreation: () => void;
  openSettingsForRoom: (room: InstitutionRoom) => void;
  setCapacity: (capacity: number) => void;
  setName: (name: string) => void;
  setAddress: (address: string) => void;
  setAddressNotes: (addressNotes: string) => void;
  setAmenities: (amenities: string[]) => void;
  reset: () => void;
};

const initialState = {
  open: false,
  name: "",
  capacity: 20,
  address: "",
  addressNotes: "",
  amenities: [],
  editMode: false,
  roomId: "",
};

export const useCreateRoomModal = create<CreateRoomModal>((set) => ({
  ...initialState,

  openSettingsForRoom: (room) => {
    set({
      open: true,
      editMode: true,
      roomId: room.id,
      name: room.name,
      capacity: room.personCapacity,
      address: room.address,
      addressNotes: room.addressNotes,
      amenities: room.amenities ? room.amenities.split(",") : [],
    });
  },
  setOpen: (open) => set({ open }),
  setName: (name) => set({ name }),
  setCapacity: (capacity) => set({ capacity }),
  setAddress: (address) => set({ address }),
  setAddressNotes: (addressNotes) => set({ addressNotes }),
  setAmenities: (amenities) => set({ amenities }),
  openRoomCreation: () => set({ ...initialState, open: true, editMode: false }),
  reset: () => set({ ...initialState }),
}));
