import type { FuxamStripeSubscription } from "@/src/utils/stripe-types";
import { useBilling } from "../zustand-billing";
import PlanBadges from "./plan-badges";
import PlanPrice from "./plan-cards/plan-price";
import SubscriptionDetails from "./plan-cards/subscription-details";
import { UserCapacity } from "./plan-cards/user-capacity";

export default function PlanAlreadyPurchased({
  subscription,
}: {
  subscription: FuxamStripeSubscription;
}) {
  const { totalUsers } = useBilling();
  return subscription ? (
    <div>
      {<PlanBadges totalUsers={totalUsers} />}
      <div className="grid grid-cols-1 divide-y divide-border border-b border-border bg-foreground lg:grid-cols-2 lg:divide-x xl:grid-cols-3">
        <PlanPrice />
        <UserCapacity />
        <SubscriptionDetails />
      </div>
    </div>
  ) : (
    <></>
  );
}
