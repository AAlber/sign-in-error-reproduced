import type { ChangeEvent } from "react";
import React from "react";
import { useTranslation } from "react-i18next";
import PasswordInput from "@/src/components/reusable/password-input";
import { Label } from "@/src/components/reusable/shadcn-ui/label";

type Props = {
  newPassword: string;
  newPasswordRepeat: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const RepeatNewPassowrd = ({
  newPassword,
  newPasswordRepeat,
  onChange,
}: Props) => {
  const { t } = useTranslation("page");
  return (
    <>
      <div className="mb-1 flex flex-col gap-3">
        <Label htmlFor="newPassword">
          {t("account_modal.security_new_password_label")}
        </Label>
        <PasswordInput
          placeholder={t("account_modal.security_new_password_label")}
          id="newPassword"
          name="newPassword"
          value={newPassword}
          autoComplete="text"
          onChange={onChange}
          className="text-contrast"
        />
      </div>

      <div className="mb-1 flex flex-col gap-3">
        <Label htmlFor="newPasswordRepeat">
          {t("account_modal.security_confirm_password_label")}
        </Label>
        <PasswordInput
          placeholder={t("account_modal.security_confirm_password_label")}
          id="newPasswordRepeat"
          name="newPasswordRepeat"
          value={newPasswordRepeat}
          autoComplete="text"
          onChange={onChange}
          className="text-contrast"
        />

        <p className="text-sm text-muted">
          {t("account_modal.security_password_requirement")}
        </p>
      </div>
    </>
  );
};

export default RepeatNewPassowrd;
