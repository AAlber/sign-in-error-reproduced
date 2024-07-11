import { create } from "zustand";

interface InputModal {
  open: boolean;
  title: string;
  description: string;
  name: string;
  action: string;
  specialCharactersAllowed: boolean;
  onConfirm: (data: string) => Promise<void> | void;
  setTitle: (title: string) => void;
  setDescription: (title: string) => void;
  setOpen: (data: boolean) => void;
  setName: (data: string) => void;
  initModal: (data: {
    title: string;
    description: string;
    name: string;
    action: string;
    specialCharactersAllowed: boolean;
    onConfirm: (data: string) => void;
  }) => void;
}

const initalState = {
  open: false,
  title: "",
  description: "",
  name: "",
  action: "",
  specialCharactersAllowed: false,
  onConfirm: () => alert("No action specified"),
};

const useInputModal = create<InputModal>((set) => ({
  ...initalState,
  setOpen: (data) => set(() => ({ open: data })),
  setName: (data) => set(() => ({ name: data })),
  initModal: (data) => set(() => ({ ...data, open: true })),
  setTitle: (title: string) => set(() => ({ title: title })),
  setDescription: (description: string) =>
    set(() => ({ description: description })),
}));

export default useInputModal;
