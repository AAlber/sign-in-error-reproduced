import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "../../reusable/modal";
import { Button } from "../../reusable/shadcn-ui/button";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../reusable/shadcn-ui/card";
import ConfirmationCode from "./confirmation-code";
import useConfirmationModal from "./zustand";

export default function ConfirmationModal() {
  const {
    open,
    title,
    description,
    actionName,
    cancelName,
    allowCancel,
    dangerousAction,
    requiredConfirmationCode,
    confirmationCode: specialConfirmationCode,
    displayComponent,
    onConfirm,
    shouldCancelOnClose,
    setOpen,
    onCancel,
    confirmationCodePlaceholder,
  } = useConfirmationModal();

  const { t } = useTranslation("page");
  const [loading, setLoading] = useState(false);
  const [userCodeInput, setUserCodeInput] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (open && requiredConfirmationCode) {
      setUserCodeInput("");
      if (specialConfirmationCode)
        return setConfirmationCode(specialConfirmationCode);
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setConfirmationCode(code);
    }

    if (!isFinished && shouldCancelOnClose && !open) onCancel();
  }, [open, requiredConfirmationCode, specialConfirmationCode, isFinished]);

  const handleModalFinish = async () => {
    setLoading(true);
    await onConfirm();
    setIsFinished(true);
    setLoading(false);
    setOpen(false);
  };

  const handleCancel = () => {
    onCancel();
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      size="md"
      allowCloseOnEscapeOrClickOutside={true}
    >
      <CardHeader className="px-0 pb-4 pt-0">
        <CardTitle>{t(title)}</CardTitle>
        <CardDescription>{t(description)}</CardDescription>
      </CardHeader>
      {displayComponent && displayComponent()}
      {requiredConfirmationCode && (
        <ConfirmationCode
          requiredCode={
            specialConfirmationCode ? specialConfirmationCode : confirmationCode
          }
          code={userCodeInput}
          setCode={setUserCodeInput}
          confirmationCodePlaceholder={confirmationCodePlaceholder}
        />
      )}
      <div className="mt-4 flex justify-end space-x-2">
        {allowCancel && <Button onClick={handleCancel}>{t(cancelName)}</Button>}
        <Button
          variant={dangerousAction ? "destructive" : "cta"}
          disabled={
            (requiredConfirmationCode && userCodeInput !== confirmationCode) ||
            loading
          }
          onClick={handleModalFinish}
        >
          {t(loading ? "general.loading" : actionName)}
        </Button>
      </div>
    </Modal>
  );
}
