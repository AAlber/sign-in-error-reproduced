import { create } from "zustand";

type Room = {
  id: string;
  name: string;
  address: string;
  amenities: string | null;
};

type RoomScheduleDialogProps = {
  room: Room | null;
  date: Date;
  open: boolean;
  setOpen: (data: boolean) => void;
  init: (data: { room: Room; date: Date }) => void;
};

const initalState = {
  open: false,
  room: null,
  date: new Date(),
};

const useRoomDialog = create<RoomScheduleDialogProps>((set, get) => ({
  ...initalState,
  setOpen: (data) => set(() => ({ open: data })),
  init: (data) => set(() => ({ ...data, open: true })),
}));

export default useRoomDialog;
