import { useTranslation } from "react-i18next";
import { addPaymentMethodClientSecret } from "@/src/client-functions/client-stripe";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { useBilling } from "../../zustand-billing";
import { useUpgradeModal } from "../zustand";

export default function AddressEditor() {
  const { t } = useTranslation("page");
  const { customer } = useBilling();
  const { setBillingAddressModalOpen } = useUpgradeModal();

  if (!customer || !customer.address) return <></>;
  const { line1, line2, city, state, country, postal_code } = customer?.address;

  return (
    <div>
      <h1 className="my-2 text-sm font-medium text-contrast">
        {t("billing_page.upgrade_modal.address_editor_title")}
      </h1>
      <div className="flex justify-between gap-x-3">
        <div className="pointer-events-none flex h-full w-full items-center justify-between border-b border-border p-2">
          <h1 className=" text-sm text-muted-contrast">
            {`${line1 + (line2 ? ", " + line2 + ", " : "")} ${city}, ${
              state ? state : country
            }, ${postal_code}`}
          </h1>
        </div>
        <Button
          onClick={() =>
            addPaymentMethodClientSecret().then(() => {
              setBillingAddressModalOpen(true);
            })
          }
        >
          {t("billing_page.upgrade_modal.address_editor_change_button")}
        </Button>
      </div>
    </div>
  );
}
