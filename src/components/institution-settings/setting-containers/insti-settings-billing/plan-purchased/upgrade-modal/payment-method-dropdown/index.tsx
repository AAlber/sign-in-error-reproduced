import { PlusCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { addPaymentMethodClientSecret } from "@/src/client-functions/client-stripe";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import PaymentInformation from "../../../payment-methods/payment-information";
import { useBilling } from "../../../zustand-billing";
import { useUpgradeModal } from "../../zustand";
import CardOptions from "./card-options";

export default function PaymentMethodDropdown() {
  const { paymentMethods } = useBilling();
  const { setAddPaymentMethodModalOpen } = useUpgradeModal();
  const { t } = useTranslation("page");
  return (
    <>
      <div className="flex">
        <div className=" h-full w-full  rounded-md  text-contrast ">
          <h1 className="mb-2 text-sm font-medium text-contrast">
            {t("billing_page.upgrade_modal.payment_method_dropdown_title")}
          </h1>
          <div className="flex items-center gap-3">
            <div className="b flex w-full justify-start gap-x-3 ">
              {paymentMethods && paymentMethods[0] && (
                <div className="w-full">
                  <PaymentInformation
                    key={paymentMethods[0].id}
                    payMethod={paymentMethods[0]}
                  />
                </div>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button>
                  {t(
                    "billing_page.upgrade_modal.payment_method_dropdown_change_button",
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="relative !h-full max-h-[300px] !w-[300px]  !overflow-y-scroll p-2"
                align="start"
              >
                {paymentMethods.length > 1 && (
                  <>
                    <CardOptions />
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem
                  onClick={() => {
                    addPaymentMethodClientSecret().then(() => {
                      setAddPaymentMethodModalOpen(true);
                    });
                  }}
                >
                  <PlusCircle className="mr-2 h-5 w-5" />
                  <span className="text-sm">
                    {t(
                      "billing_page.upgrade_modal.payment_method_dropdown_add_new",
                    )}
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </>
  );
}
