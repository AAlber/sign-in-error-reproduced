import { useTranslation } from "react-i18next";
import Modal from "../../reusable/modal";
import { Button } from "../../reusable/shadcn-ui/button";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../reusable/shadcn-ui/card";
import useInputModal from "./zustand";

export default function InputModal() {
  const {
    open,
    title,
    specialCharactersAllowed,
    description,
    action,
    name,
    onConfirm,
    setName,
    setOpen,
  } = useInputModal();
  const { t } = useTranslation("page");

  return (
    <Modal open={open} setOpen={setOpen}>
      <CardHeader className="px-0 pb-4 pt-0">
        <CardTitle>{t(title)}</CardTitle>
        <CardDescription>{t(description)}</CardDescription>
      </CardHeader>
      <div className="flex">
        <div className="flex w-full flex-col gap-2 text-center sm:text-left">
          <input
            maxLength={50}
            id={"rename-modal-input"}
            name="rename-modal-input"
            type="text"
            value={name}
            onChange={(event) => {
              if (specialCharactersAllowed) {
                setName(event.target.value);
              } else {
                setName(event.target.value.replace(/[^a-zA-Z0-9 ]/g, ""));
              }
            }}
            className="mb-3 mt-4 w-full rounded-md border border-border bg-foreground py-2 text-sm text-contrast"
          />
        </div>
      </div>
      <div className="mt-4 flex gap-2 sm:flex-row-reverse">
        <Button
          variant={"cta"}
          onClick={async () => {
            setOpen(false);
            onConfirm(name);
          }}
        >
          {t(action)}
        </Button>
        <Button onClick={() => setOpen(false)}>{t("general.cancel")}</Button>
      </div>
    </Modal>
  );
}
