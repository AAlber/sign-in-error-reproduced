import { useUser } from "@clerk/nextjs";
import type { EmailAddressResource } from "@clerk/types";
import React from "react";
import { sortEmails } from "@/src/client-functions/client-profile-modal";
import EmailAddress from "./email-address";

type Props = {
  primaryEmail: string;
  onSentVerificationCode: React.Dispatch<React.SetStateAction<boolean>>;
  onEmailToBeVerified: React.Dispatch<
    React.SetStateAction<EmailAddressResource | undefined>
  >;
};

const EmailsList = ({
  primaryEmail,
  onSentVerificationCode,
  onEmailToBeVerified,
}: Props) => {
  const { user: clerkUser } = useUser();
  if (!clerkUser) return null;

  return (
    <>
      {sortEmails(clerkUser.emailAddresses, primaryEmail).map((email) => (
        <EmailAddress
          key={email.id}
          email={email}
          primaryEmail={primaryEmail!}
          onSentVerificationCode={onSentVerificationCode}
          onEmailToBeVerified={onEmailToBeVerified}
        />
      ))}
    </>
  );
};

export default EmailsList;
