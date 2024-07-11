import { Elements } from "@stripe/react-stripe-js";
import dayjs from "dayjs";
import { useTheme } from "next-themes";
import { getAttributesForElements } from "@/src/client-functions/client-stripe/utils";
import useUser from "@/src/zustand/user";
import { useBilling } from "../zustand-billing";
import UpgradeModal from "./upgrade-modal";
import PaymentModal from "./upgrade-modal/payment-modal";

export default function UpgradeSection() {
  const { addPaymentMethodClientSecret } = useBilling();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const { user } = useUser();
  const locale = dayjs.locale(user.language);
  const { stripe, options } = getAttributesForElements(
    isDark,
    locale,
    addPaymentMethodClientSecret,
  );
  return (
    <>
      <UpgradeModal />
      {addPaymentMethodClientSecret && (
        <Elements stripe={stripe} options={options}>
          <PaymentModal />
        </Elements>
      )}
    </>
  );
}
