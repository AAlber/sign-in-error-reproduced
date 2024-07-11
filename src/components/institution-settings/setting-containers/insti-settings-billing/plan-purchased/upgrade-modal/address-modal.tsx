import { AddressElement, useElements } from "@stripe/react-stripe-js";
import { updateCustomerInformation } from "@/src/client-functions/client-stripe";
import { addressElementOptions } from "@/src/client-functions/client-stripe/utils";
import Modal from "@/src/components/reusable/multi-page-modal";
import { useBilling } from "../../zustand-billing";
import { useUpgradeModal } from "../zustand";

export default function AddressModal() {
  const { billingAddressModalOpen, setBillingAddressModalOpen } =
    useUpgradeModal();
  const {
    setAddPaymentMethodClientSecret,
    addPaymentMethodClientSecret,
    setCustomer,
  } = useBilling();

  const elements = useElements();
  const submitBillingInfo = async () => {
    const elementValues = await elements
      ?.getElement(AddressElement)
      ?.getValue();
    if (elementValues?.complete) {
      if (addPaymentMethodClientSecret) {
        const result = await updateCustomerInformation(elementValues);
        setCustomer(result);
      }
      setAddPaymentMethodClientSecret(undefined);
    }
  };

  return (
    <Modal
      open={billingAddressModalOpen}
      title={"billing_page.upgrade_modal.address_modal_title"}
      finishButtonText={
        "billing_page.upgrade_modal.address_modal_finish_button"
      }
      onFinish={async () => await submitBillingInfo()}
      onClose={() => {
        return;
      }}
      setOpen={setBillingAddressModalOpen}
      pages={[
        {
          title: "billing_page.upgrade_modal.address_modal_step_address_title",
          tabTitle:
            "billing_page.upgrade_modal.address_modal_step_address_tab_title",
          description:
            "billing_page.upgrade_modal.address_modal_step_address_subtitle",
          nextStepRequirement: () => true,
          children: (
            <div className="flex h-full w-full flex-col gap-5">
              <AddressElement
                id="payment-element"
                options={addressElementOptions}
              />
            </div>
          ),
        },
      ]}
    />
  );
}
