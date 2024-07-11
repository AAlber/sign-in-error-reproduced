import { useUser as useClerkUser } from "@clerk/nextjs";
import type { ChangeEvent } from "react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  changePassword,
  handleErrorChangePassword,
} from "@/src/client-functions/client-profile-modal";
import PasswordInput from "@/src/components/reusable/password-input";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { Label } from "@/src/components/reusable/shadcn-ui/label";
import RepeatNewPassowrd from "./components/security/repeat-new-password";

export default function SecurityOverview() {
  const { t } = useTranslation("page");
  const { user: clerkUser } = useClerkUser();
  const [loading, setLoading] = useState(false);

  const [passwordDetail, setPasswordDetail] = useState({
    currentPassword: "",
    newPassword: "",
    newPasswordRepeat: "",
  });

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) =>
    setPasswordDetail({ ...passwordDetail, [e.target.name]: e.target.value });

  const handleChangePassword = async () => {
    try {
      setLoading(true);
      await changePassword(
        passwordDetail.newPassword,
        passwordDetail.currentPassword,
        clerkUser,
      );
      setPasswordDetail({
        currentPassword: "",
        newPassword: "",
        newPasswordRepeat: "",
      });
    } catch (e: any) {
      handleErrorChangePassword(e);
    } finally {
      setLoading(false);
    }
  };

  const buttonDisabled =
    passwordDetail.newPasswordRepeat !== passwordDetail.newPassword ||
    passwordDetail.newPassword.length < 8;

  return (
    <form className="flex flex-col gap-4">
      <div className="mb-1 flex flex-col gap-3">
        <Label htmlFor="currentPassword">
          {t("account_modal.security_current_password_label")}
        </Label>
        <PasswordInput
          placeholder={t("account_modal.security_current_password_label")}
          id="currentPassword"
          name="currentPassword"
          value={passwordDetail.currentPassword}
          autoComplete="text"
          onChange={handleChangeInput}
          className="text-contrast"
        />
      </div>

      <RepeatNewPassowrd
        newPassword={passwordDetail.newPassword}
        newPasswordRepeat={passwordDetail.newPasswordRepeat}
        onChange={handleChangeInput}
      />

      <Button
        disabled={buttonDisabled}
        className="self-start"
        onClick={handleChangePassword}
      >
        {!loading ? t("general.save") : t("general.loading")}
      </Button>
    </form>
  );
}
