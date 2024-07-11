import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { createStripeConnectAccount } from "@/src/client-functions/client-paid-access-pass";
import { useDebounce } from "@/src/client-functions/client-utils/hooks";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import WithToolTip from "@/src/components/reusable/with-tooltip";
import { useAccessPasses } from "../zustand";

export default function CreateStripeAccountButton() {
  const { accountInfo } = useAccessPasses();
  const { t } = useTranslation("page");
  const [disabled, setDisabled] = useState(false);
  useDebounce(
    () => {
      if (disabled) {
        setDisabled(false);
      }
    },
    [disabled],
    4000,
  );
  return (
    <WithToolTip text="organization_settings.create_recipient_account_hover">
      <div className="flex">
        <Button
          type="button"
          disabled={disabled}
          className="flex gap-2"
          onClick={async () => {
            setDisabled(true);
            const res = await createStripeConnectAccount();
            window.open(res, "_blank");
          }}
        >
          {accountInfo?.id
            ? t("organization_settings.complete_recipient_account")
            : t("organization_settings.create_recipient_account")}
          <Image
            src="/images/stripe-logo.png"
            alt="Stripe Logo"
            width={16}
            height={16}
            className="rounded-sm"
          />
        </Button>
      </div>
    </WithToolTip>
  );
}
