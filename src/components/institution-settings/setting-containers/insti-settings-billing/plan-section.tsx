import { useEffect } from "react";
import { getInfoFromPaymentStage } from "@/src/client-functions/client-stripe/data-extrapolation";
import type { SupportPackages } from "@/src/client-functions/client-stripe/price-id-manager";
import { setCorrectPaymentStage } from "@/src/client-functions/client-stripe/setters";
import { toast } from "@/src/components/reusable/toaster/toast";
import useUser from "@/src/zustand/user";
import NoPlan from "./no-plan";
import PlanAlreadyPurchased from "./plan-purchased";
import { useBilling } from "./zustand-billing";

export default function PlanSection() {
  const { setSupportPackage, subscription } = useBilling();
  const { hasPlan, hasCancelledOrNoPlan } = getInfoFromPaymentStage();
  const { user } = useUser();
  useEffect(() => {
    if (!subscription) {
      toast.error("toast-no-subscription-found", {
        description: "toast-no-subscription-found-description",
        duration: 5000,
      });
    }
    setCorrectPaymentStage(subscription);
    if (
      user.institution?.stripeAccountInfo &&
      !user.institution?.stripeAccountInfo.supportPackage
    ) {
      setSupportPackage(
        user.institution?.stripeAccountInfo.supportPackage as SupportPackages,
      );
    }
  }, []);

  return (
    <>
      {(hasCancelledOrNoPlan || !subscription) && <NoPlan />}
      {hasPlan && <PlanAlreadyPurchased subscription={subscription} />}
    </>
  );
}
