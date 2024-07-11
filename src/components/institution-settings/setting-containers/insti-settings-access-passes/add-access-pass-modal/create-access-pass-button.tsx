import { useState } from "react";
import { useTranslation } from "react-i18next";
import type Stripe from "stripe";
import {
  createAccessPass,
  getAndSetAccessPassStatusInfos,
} from "@/src/client-functions/client-access-pass";
import { isCreateOrUpdateAccessPassEnabled } from "@/src/client-functions/client-paid-access-pass/utils";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import type { CreateAccessPassData } from "@/src/utils/stripe-types";
import { useAccessPasses } from "../zustand";
import { useAccessPassCreator } from "./zustand";

export default function CreateAccessPassButton() {
  const {
    maxUsers,
    withMemberLimit,
    taxRate,
    priceForUser,
    description,
    currency,
    isPaid,
    name,
    priceId,
    layer,
  } = useAccessPassCreator();
  const { setOpenAddAccessPassModal } = useAccessPasses();
  const [loading, setLoading] = useState(false);
  const unitAmount = priceForUser ? Math.round(priceForUser * 100) : 0;
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const { t } = useTranslation("page");
  return (
    <Button
      variant={"cta"}
      enabled={!buttonDisabled}
      onClick={async () => {
        if (
          isCreateOrUpdateAccessPassEnabled("create", {
            layer,
            name,
            description,
            isPaid,
            maxUsers,
            withMemberLimit,
            taxRate,
            priceForUser,
          })
        ) {
          const data: CreateAccessPassData = {
            ...(isPaid
              ? {
                  productInfo: {
                    currency: currency === "$" ? "usd" : "eur",
                    unitAmount,
                    description,
                    taxRateId: (taxRate as Stripe.TaxRate).id,
                    name,
                  },
                }
              : {}),
            isPaid,
            priceId,
            maxUsers: withMemberLimit ? maxUsers : undefined,
            layerId: layer?.id as string,
          };
          setButtonDisabled(true);
          setLoading(true);

          // Could be optimized to single request
          await createAccessPass(data);
          await getAndSetAccessPassStatusInfos();
          setLoading(false);
          setOpenAddAccessPassModal(false);
        }
      }}
    >
      {loading
        ? t("organization_settings.adding_access_pass")
        : t("organization_settings.add_access_pass")}
    </Button>
  );
}
