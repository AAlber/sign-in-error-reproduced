import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getSubscription,
  updateDefaultPaymentMethod,
} from "@/src/client-functions/client-stripe";
import { reorderPaymentMethods } from "@/src/client-functions/client-stripe/setters";
import { toast } from "@/src/components/reusable/toaster/toast";
import TruncateHover from "@/src/components/reusable/truncate-hover";
import { useBilling } from "../zustand-billing";

export default function DefaultButton(props: { paymethodId: string }) {
  const { paymethodId } = props;
  const { subscription, setSubscription, paymentMethods } = useBilling();
  const { t } = useTranslation("page");

  const [isLoading, setIsLoading] = useState("");
  return !subscription ||
    !subscription!.default_payment_method ||
    paymethodId === subscription!.default_payment_method ? (
    <></>
  ) : (
    <button
      // update default payment method
      onClick={async () => {
        setIsLoading(paymethodId);
        const response =
          subscription &&
          (await updateDefaultPaymentMethod(paymethodId, subscription));
        if (response && !response.ok) {
          toast.responseError({
            response: response,
            title: "Failed to update your default payment method.",
          });
          return undefined;
        }
        const sub = await getSubscription();
        setSubscription(sub);
        reorderPaymentMethods({
          paymentMethods: paymentMethods,
          subscription: sub,
        });
        setIsLoading("");
      }}
      className="my-4 justify-self-end rounded-md border-2 border-border bg-foreground px-1.5 py-0.5 text-xs hover:bg-secondary "
    >
      <TruncateHover
        text={
          isLoading === paymethodId
            ? t("billing_page.payment_methods.default_button1")
            : t("billing_page.payment_methods.default_button2")
        }
        truncateAt={15}
      />
    </button>
  );
}
