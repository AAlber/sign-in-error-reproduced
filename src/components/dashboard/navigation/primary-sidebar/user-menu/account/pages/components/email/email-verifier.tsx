import { useUser as useClerkUser } from "@clerk/nextjs";
import type { EmailAddressResource } from "@clerk/types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { verifyEmail } from "@/src/client-functions/client-profile-modal";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { Input } from "@/src/components/reusable/shadcn-ui/input";
import { Label } from "@/src/components/reusable/shadcn-ui/label";
import { toast } from "@/src/components/reusable/toaster/toast";

type Props = {
  emailToBeVerified: EmailAddressResource;
  goBack: () => void;
};

export default function EmailVerifier({ emailToBeVerified, goBack }: Props) {
  const { t } = useTranslation("page");
  const { user: clerkUser } = useClerkUser();
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerifyEmail = async () => {
    try {
      await verifyEmail(
        emailToBeVerified.id,
        verificationCode,
        goBack,
        clerkUser,
      );
    } catch {
      toast.error("toast.account_modal_verify_email_error_title", {
        description: "toast.account_modal_verify_email_error_desc",
      });
    } finally {
      setLoading(false);
    }
  };

  const buttonDisabled = verificationCode.trim().length === 0 || loading;

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="verificationCode">Verification code</Label>

      <Input
        name="verificationCode"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        type="text"
        placeholder="123456"
      />
      <p className="m-0 text-sm text-gray-600">
        Enter the verification code sent to
        <span className="font-semibold"> {emailToBeVerified.emailAddress}</span>
      </p>
      <Button
        disabled={buttonDisabled}
        onClick={handleVerifyEmail}
        className="mt-1 w-[120px]"
      >
        {loading
          ? t("general.loading")
          : t("account_modal.email_overview_verify_button")}
      </Button>
    </div>
  );
}
