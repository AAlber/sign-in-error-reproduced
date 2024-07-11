import type { EmailAddressResource, UserResource } from "@clerk/types";
import { t } from "i18next";
import type { ChangeEvent } from "react";
import { z } from "zod";
import { toast } from "../components/reusable/toaster/toast";

export const createEmailAddress = async (
  email: string,
  clerkUser?: UserResource | null,
) => {
  const emailSchema = z.string().email();
  const schemaCheck = emailSchema.safeParse(email);
  if (!schemaCheck.success) {
    toast.warning("invalid_email", {});
    return;
  }
  await clerkUser?.createEmailAddress({ email });
  await clerkUser?.reload();
};

export const verifyEmail = async (
  emailAdddressId: string,
  verificationCode: string,
  goBack: () => void,
  clerkUser?: UserResource | null,
) => {
  const toBeVerified = clerkUser?.emailAddresses.find(
    (email) => email.id === emailAdddressId,
  );

  await toBeVerified?.attemptVerification({ code: verificationCode });
  toast.success("toast.account_modal_verify_email_success_title", {
    icon: "✅",
  });
  goBack();
};

export const sendEmailVerificationCode = async (
  emailAddressId: string,
  clerkUser?: UserResource | null,
) => {
  const toBeVerified = clerkUser?.emailAddresses.find(
    (email) => email.id === emailAddressId,
  );
  await toBeVerified?.prepareVerification({ strategy: "email_code" });

  return toBeVerified;
};

export const removeEmail = async (
  emailAddressId: string,
  clerkUser?: UserResource | null,
) => {
  const toBeRemoved = clerkUser?.emailAddresses.find(
    (email) => email.id === emailAddressId,
  );
  await toBeRemoved?.destroy();
};

export const changeProfilePicutre = async (
  event: ChangeEvent<HTMLInputElement>,
  clerkUser: UserResource,
) => {
  const file = event.currentTarget.files && event.currentTarget.files[0];
  if (!file) return null;

  const largerThan10MB = file.size / 1024 / 1024 > 10;
  if (largerThan10MB) {
    toast.warning("toast.org_settings_update_logo_warning", {});
    return null;
  }

  const uploadedImage = await clerkUser.setProfileImage({ file });

  if (uploadedImage) {
    return file;
  }

  toast.warning("toast.org_settings_update_logo_warning", {});
  return null;
};

export const sortEmails = (
  emails?: EmailAddressResource[],
  primaryEmail?: string,
) => {
  return emails!.sort((a, b) => {
    if (a.emailAddress === primaryEmail) return -1;
    if (b.emailAddress === primaryEmail) return 1;

    if (
      a.verification.status === "verified" &&
      b.verification.status !== "verified"
    )
      return -1;
    if (
      a.verification.status !== "verified" &&
      b.verification.status === "verified"
    )
      return 1;

    return 0;
  });
};

export const changePassword = async (
  newPassword: string,
  currentPassword: string,
  clerkUser?: UserResource | null,
) => {
  await clerkUser?.updatePassword({
    newPassword: newPassword,
    currentPassword: currentPassword,
    signOutOfOtherSessions: true,
  });
  toast.success("toast.account_modal_change_password_success_title", {});
};

export const handleErrorChangePassword = (e: any) => {
  const error = JSON.parse(JSON.stringify(e)).errors[0];
  if (error.code) {
    const description =
      error.code === "form_password_pwned"
        ? t("toast.account_modal_change_password_insecure_new_password_desc")
        : t("toast.account_modal_change_password_incorrect_password_desc");

    toast.warning("toast.account_modal_change_password_error_title", {
      description,
    });
  }
};
