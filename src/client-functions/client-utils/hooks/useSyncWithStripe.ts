import { useRouter } from "next/router";
import { useEffect } from "react";
import { checkSubscriptionAndOverage } from "../../client-stripe/alerts";
import { getAndSetTotalUsers } from "../../client-stripe/setters";

export function useSyncWithStripe() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    getAndSetTotalUsers();
    !router.query.state && checkSubscriptionAndOverage();
  }, [router.isReady]);
}
