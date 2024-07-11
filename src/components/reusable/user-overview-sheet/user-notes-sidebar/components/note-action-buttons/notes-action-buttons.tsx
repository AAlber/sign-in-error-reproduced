import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import Spinner from "@/src/components/spinner";

interface Props {
  type: "new" | "update";
  onCancel: () => Promise<void> | void;
  onMainAction: () => Promise<void> | void;
  isSavingEnabled: boolean;
}

export const NotesActionButtons = ({
  type,
  onCancel,
  onMainAction,
  isSavingEnabled,
}: Props) => {
  const { t } = useTranslation("page");
  const [isCanceling, setIsCanceling] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  return (
    <div className="flex w-full gap-x-2 pt-1">
      <Button
        className="w-full"
        onClick={async () => {
          setIsCanceling(true);
          await onCancel();
          setIsCanceling(false);
        }}
      >
        {type === "new" ? t("user_notes.cancel") : t("user_notes.delete")}
        {isCanceling && <Spinner className="ml-2 h-4 w-4" />}
      </Button>
      <Button
        disabled={!isSavingEnabled}
        className="w-full"
        variant={"cta"}
        onClick={async () => {
          setIsSaving(true);
          await onMainAction();
          setIsSaving(false);
        }}
      >
        {type === "new" ? t("general.save") : t("user_notes.update_note")}
        {isSaving && <Spinner className="ml-2 h-4 w-4" />}
      </Button>
    </div>
  );
};
