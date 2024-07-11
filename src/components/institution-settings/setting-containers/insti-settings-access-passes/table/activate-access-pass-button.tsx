import { useTranslation } from "react-i18next";
import { createAccessPassSubscription } from "@/src/client-functions/client-access-pass";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import type { AccessPassStatusInfo } from "@/src/utils/stripe-types";

export default function ActivateAccessPassButton({
  info,
}: {
  info: AccessPassStatusInfo;
}) {
  const { t } = useTranslation("page");
  return (
    <Button
      variant={"positive"}
      onClick={async () => {
        const res = await createAccessPassSubscription({
          priceId: info.accessPass.stripePriceId,
          accessPassId: info.accessPass.id,
        });
        window.open(res.sessionUrl);
      }}
    >
      {t("activate")}
    </Button>
  );
}
