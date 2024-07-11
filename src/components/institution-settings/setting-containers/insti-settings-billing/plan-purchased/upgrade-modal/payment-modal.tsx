import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { confirmAddingPayMethod } from "@/src/client-functions/client-stripe";
import { paymentElementOptions } from "@/src/client-functions/client-stripe/utils";
import Modal from "@/src/components/reusable/multi-page-modal";
import { useBilling } from "../../zustand-billing";
import { useUpgradeModal } from "../zustand";

export default function PaymentModal() {
  const { setAddPaymentMethodModalOpen, addPaymentMethodModalOpen } =
    useUpgradeModal();
  const { setAddPaymentMethodClientSecret, addPaymentMethodClientSecret } =
    useBilling();

  const elements = useElements();
  const stripe = useStripe();
  return (
    <Modal
      open={addPaymentMethodModalOpen}
      title={"billing_page.upgrade_modal.payment_modal_title"}
      finishButtonText={
        "billing_page.upgrade_modal.payment_modal_finish_button"
      }
      onFinish={async () => {
        if (addPaymentMethodClientSecret) {
          await confirmAddingPayMethod(
            elements,
            stripe,
            addPaymentMethodClientSecret,
            true,
          );
        }
        setAddPaymentMethodClientSecret(undefined);
      }}
      onClose={() => {
        console.log("close");
      }}
      setOpen={setAddPaymentMethodModalOpen}
      pages={[
        {
          title: "billing_page.upgrade_modal.payment_modal_step_payment_title",
          tabTitle:
            "billing_page.upgrade_modal.payment_modal_step_payment_tab_title",
          description:
            "billing_page.upgrade_modal.payment_modal_step_payment_subtitle",
          nextStepRequirement: () => true,
          children: (
            <div className="flex h-full w-full flex-col gap-5">
              <PaymentElement
                id="payment-element"
                options={paymentElementOptions}
              />
            </div>
          ),
        },
      ]}
    />
  );
}
