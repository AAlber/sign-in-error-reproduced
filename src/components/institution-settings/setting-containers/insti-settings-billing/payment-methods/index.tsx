import { Elements } from "@stripe/react-stripe-js";
import dayjs from "dayjs";
import { useTheme } from "next-themes";
import type Stripe from "stripe";
import {
  addPaymentMethodClientSecret,
  getPaymentMethods,
  updateDefaultPaymentMethodIfNecessary,
} from "@/src/client-functions/client-stripe";
import { filterDuplicateSepaMethods } from "@/src/client-functions/client-stripe/data-extrapolation";
import { getAttributesForElements } from "@/src/client-functions/client-stripe/utils";
import AsyncComponent from "@/src/components/reusable/async-component";
import SettingsSection from "@/src/components/reusable/settings/settings-section";
import useUser from "@/src/zustand/user";
import { useUpgradeModal } from "../plan-purchased/zustand";
import { useBilling } from "../zustand-billing";
import AddPaymentMethod from "./add-payment-method";
import PaymentInformation from "./payment-information";

export default function PaymentMethods() {
  const {
    addPaymentMethodClientSecret: clientSecret,
    setPaymentMethods,
    subscription,
    paymentMethods,
  } = useBilling();
  const { setUpgradeModalOpen } = useUpgradeModal();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { user } = useUser();
  const locale = dayjs.locale(user.language);
  const { stripe, options } = getAttributesForElements(
    isDark,
    locale,
    clientSecret,
  );
  return (
    <AsyncComponent
      promise={async () => {
        const paymentMethods = await getPaymentMethods();
        const paymentMethodsData =
          paymentMethods.data as Stripe.PaymentMethod[];
        const filteredPaymentMethods =
          filterDuplicateSepaMethods(paymentMethodsData);
        setPaymentMethods(filteredPaymentMethods);
        subscription &&
          updateDefaultPaymentMethodIfNecessary(
            paymentMethods ? paymentMethods.data : [],
            subscription,
          );
        return filteredPaymentMethods;
      }}
      component={(paymentMethods: Stripe.PaymentMethod[]) =>
        paymentMethods.length === 0 ? (
          <></>
        ) : (
          <>
            {clientSecret ? (
              <Elements stripe={stripe} options={options}>
                <AddPaymentMethod />
              </Elements>
            ) : (
              <div>
                <SettingsSection
                  title="billing_page.payment_methods.title"
                  subtitle={"billing_page.payment_methods.subtitle"}
                  footerButtonText="billing_page.payment_methods.footer_button"
                  footerButtonDisabled={false}
                  footerButtonAction={() => addPaymentMethodClientSecret()}
                >
                  <div className="bg-fuxa flex h-full w-full  flex-wrap items-center gap-5">
                    {paymentMethods.map((payMethod) => {
                      return (
                        <div key={payMethod.id} className="w-[270px]   ">
                          <div className="mt-3  w-auto">
                            <PaymentInformation
                              payMethod={payMethod}
                              showDefaultButton={true}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </SettingsSection>
              </div>
            )}
          </>
        )
      }
    />
  );
}
