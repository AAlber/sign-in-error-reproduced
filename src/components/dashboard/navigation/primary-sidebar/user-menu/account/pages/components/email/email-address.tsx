import { useUser as useClerkUser } from "@clerk/nextjs";
import type { EmailAddressResource } from "@clerk/types";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  removeEmail,
  sendEmailVerificationCode,
} from "@/src/client-functions/client-profile-modal";
import { toast } from "@/src/components/reusable/toaster/toast";
import Spinner from "@/src/components/spinner";
import { PrimaryEmailBadge, UnverifiedEmailBadge } from "./email-badges";
import {
  GetVerificationCodeButton,
  RemoveEmailButton,
  SetAsPrimaryEmailButton,
} from "./email-buttons";

type Props = {
  email: EmailAddressResource;
  primaryEmail: string;
  onSentVerificationCode: Dispatch<SetStateAction<boolean>>;
  onEmailToBeVerified: Dispatch<
    SetStateAction<EmailAddressResource | undefined>
  >;
};

export default function EmailAddress({
  email,
  primaryEmail,
  onSentVerificationCode,
  onEmailToBeVerified,
}: Props) {
  const [loading, setLoading] = useState(false);

  const { user: clerkUser } = useClerkUser();
  const { t } = useTranslation("page");

  const isPrimaryEmail = primaryEmail === email.toString();

  const handleSetAsPrimary = async (emailAddressId: string) => {
    try {
      setLoading(true);
      await clerkUser?.update({ primaryEmailAddressId: emailAddressId });
    } catch {
      toast.error("toast.account_modal_set_email_as_primary_error_title", {});
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveEmail = async (emailAddressId: string) => {
    try {
      setLoading(true);
      await removeEmail(emailAddressId, clerkUser);
    } catch (e) {
      return toast.error("toast.account_modal_remove_email_error_title", {});
    } finally {
      setLoading(false);
    }
  };

  const handleSendVerificationCode = async (emailAddressId: string) => {
    try {
      setLoading(true);
      const toBeVerified = await sendEmailVerificationCode(
        emailAddressId,
        clerkUser,
      );
      onEmailToBeVerified(toBeVerified);
      onSentVerificationCode(true);
    } catch (e: any) {
      return toast.error("toast.account_modal_remove_email_error_title", {});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex w-full items-center gap-4 rounded-md px-3 py-2
      ${
        isPrimaryEmail
          ? `bg-primary/30 hover:bg-primary/40`
          : `hover:bg-primary/10`
      }`}
    >
      {loading && <Spinner size="w-3 h-3" />}
      <p className="text-sm font-bold">{email.emailAddress}</p>
      {email.verification.status !== "verified" && <UnverifiedEmailBadge />}
      {isPrimaryEmail ? (
        <PrimaryEmailBadge />
      ) : (
        <div className="ml-auto">
          {email.verification.status === "verified" ? (
            <SetAsPrimaryEmailButton
              loading={loading}
              onClick={() => handleSetAsPrimary(email.id)}
            />
          ) : (
            <GetVerificationCodeButton
              loading={loading}
              onClick={() => handleSendVerificationCode(email.id)}
            />
          )}
          <RemoveEmailButton
            loading={loading}
            onClick={() => handleRemoveEmail(email.id)}
          />
        </div>
      )}
    </div>
  );
}
