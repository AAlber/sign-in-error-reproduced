import type { SetStateAction } from "react";
import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/reusable/shadcn-ui/dialog";

type Props = {
  open: boolean;
  loading: boolean;
  setOpen: (open: SetStateAction<boolean>) => void;
  onConfirm: () => Promise<void>;
};

export const ConfirmChangeGradingDialog = ({
  open,
  loading,
  setOpen,
  onConfirm,
}: Props) => {
  const { t } = useTranslation("page");

  const handleConfirm = async () => {
    await onConfirm();
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("content_rating.confirm_change_grading_title")}
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm">{t("content_rating.confirm_change_grading")}</p>
        <DialogFooter className="flex w-full items-center justify-between">
          <Button
            disabled={loading}
            variant="default"
            onClick={() => setOpen(false)}
          >
            {t("general.cancel")}
          </Button>
          <Button disabled={loading} variant="cta" onClick={handleConfirm}>
            {loading ? t("general.loading") : t("general.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
