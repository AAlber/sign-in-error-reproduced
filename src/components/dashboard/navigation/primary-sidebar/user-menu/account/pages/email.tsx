import { useUser as useClerkUser } from "@clerk/nextjs";
import type { EmailAddressResource } from "@clerk/types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { createEmailAddress } from "@/src/client-functions/client-profile-modal";
import { toast } from "@/src/components/reusable/toaster/toast";
import Skeleton from "@/src/components/skeleton";
import EmailAdder from "./components/email/email-adder";
import EmailVerifier from "./components/email/email-verifier";
import EmailsList from "./components/email/emails-list";

export default function EmailOverview() {
  const { t } = useTranslation("page");
  const { user: clerkUser } = useClerkUser();
  const [loading, setLoading] = useState(false);
  const emailSchema = z.string().email();

  const [showVerifyInput, setShowVerifyInput] = useState(false);
  const [emailToBeVerified, setEmailToBeVerified] = useState<
    EmailAddressResource | undefined
  >();

  const primaryEmail = clerkUser?.primaryEmailAddress!.toString();

  const handleAddNewEmailAddress = async (email: string) => {
    try {
      setLoading(true);
      await createEmailAddress(email, clerkUser);
    } catch {
      toast.error("toast.account_modal_add_email_address_error_title", {});
    } finally {
      setLoading(false);
    }
  };

  if (!clerkUser) return null;

  return (
    <div className="flex flex-col gap-3">
      {loading ? (
        <div className="h-[300px] w-full overflow-hidden rounded-md border border-border bg-foreground">
          <Skeleton />
        </div>
      ) : (
        <div
          className={`flex h-[300px] w-full flex-col gap-2 overflow-auto  
        ${
          !showVerifyInput
            ? `rounded-md border border-border bg-foreground p-3 `
            : ``
        }
        `}
        >
          {!showVerifyInput ? (
            <EmailsList
              primaryEmail={primaryEmail || ""}
              onSentVerificationCode={setShowVerifyInput}
              onEmailToBeVerified={setEmailToBeVerified}
            />
          ) : (
            <>
              {emailToBeVerified && (
                <EmailVerifier
                  emailToBeVerified={emailToBeVerified}
                  goBack={() => setShowVerifyInput(false)}
                />
              )}
            </>
          )}
        </div>
      )}

      {!showVerifyInput && <EmailAdder onSubmit={handleAddNewEmailAddress} />}
    </div>
  );
}
