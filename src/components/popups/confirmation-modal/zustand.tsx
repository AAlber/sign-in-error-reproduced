import { create } from "zustand";

interface ConfirmationModal {
  open: boolean;
  title: string;
  description: string;
  displayComponent: () => JSX.Element | null;
  actionName: string;
  cancelName: string;
  allowCancel: boolean;
  dangerousAction?: boolean;
  requiredConfirmationCode: boolean;
  confirmationCode?: string;
  confirmationCodePlaceholder?: string;
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;
  shouldCancelOnClose: boolean;
  setOpen: (data: boolean) => void;
  resetModal: () => void;
  initModal: (data: {
    title: string;
    description: string;
    actionName: string;
    cancelName?: string;
    onConfirm: () => Promise<void> | void;
    onCancel?: () => void;
    displayComponent?: () => JSX.Element;
    allowCancel?: boolean;
    dangerousAction?: boolean;
    requiredConfirmationCode?: boolean;
    confirmationCode?: string;
    shouldCancelOnClose?: boolean;
  }) => void;
}

const initalState = {
  open: false,
  title: "",
  description: "",
  actionName: "",
  cancelName: "general.cancel",
  displayComponent: () => <></>,
  allowCancel: true,
  dangerousAction: false,
  requiredConfirmationCode: false,
  confirmationCode: "",
  confirmationCodePlaceholder: "",
  shouldCancelOnClose: false,
  onConfirm: () => alert("No action specified"),
  onCancel: () => console.log("Cancelled."),
};

const useConfirmationModal = create<ConfirmationModal>()((set) => ({
  ...initalState,
  resetModal: () => set(() => initalState),
  setOpen: (data) => set(() => ({ open: data })),
  initModal: (data) =>
    set(() => ({
      ...initalState,
      ...data,
      displayComponent: data.displayComponent
        ? data.displayComponent
        : () => <></>,
      open: true,
    })),
}));

export default useConfirmationModal;
