import useConfirmationModal from "../components/popups/confirmation-modal/zustand";

export default function confirmAction(
  action: () => Promise<any> | void,
  settings: {
    title: string;
    description: string;
    // name of the main action button (e.g. "Delete")
    actionName: string;
    // name of the cancel button (default "Cancel")
    cancelName?: string;
    // function to call when the user clicks the cancel button (default: close modal)
    onCancel?: () => void;
    // any component to display above the buttons (e.g. a warning or a text input)
    displayComponent?: () => JSX.Element;
    // whether the user can cancel the action (default: true)
    allowCancel?: boolean;
    // whether the action is dangerous (e.g. deleting something, will make the action button red)
    dangerousAction?: boolean;
    // whether the user has to enter a confirmation code (default: false)
    // if true, the user has to enter a four digit code to confirm the action
    requiredConfirmationCode?: boolean;
    // specify a custom confirmation code (default: random four digit number)
    confirmationCode?: string;
    // custom placeholder for the confirmation code input
    confirmationCodePlaceholder?: string;
    // if true, call the onCancel method on close of modal
    shouldCancelOnClose?: boolean;
  },
) {
  const { initModal, resetModal } = useConfirmationModal.getState();
  resetModal();
  initModal({ ...settings, onConfirm: action });
}

export function chooseAction(
  actions: {
    mainAction: () => Promise<void> | void;
    mainActionName: string;
    secondaryAction: () => Promise<void> | void;
    secondaryActionName: string;
  },
  settings: {
    title: string;
    description: string;
    // function to call when the user clicks the cancel button (default: close modal)
    // any component to display above the buttons (e.g. a warning or a text input)
    displayComponent?: () => JSX.Element;
    // whether the user can cancel the action (default: true)
    allowCancel?: boolean;
    // whether the action is dangerous (e.g. deleting something, will make the action button red)
    dangerousAction?: boolean;
    // whether the user has to enter a confirmation code (default: false)
    // if true, the user has to enter a four digit code to confirm the action
    requiredConfirmationCode?: boolean;
  },
) {
  const { initModal, resetModal } = useConfirmationModal.getState();
  resetModal();
  initModal({
    ...settings,
    onConfirm: actions.mainAction,
    onCancel: actions.secondaryAction,
    actionName: actions.mainActionName,
    cancelName: actions.secondaryActionName,
  });
}
