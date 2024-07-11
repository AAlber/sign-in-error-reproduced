import SubscriptionSupport from "./subscription-support";
import SubscriptionUsers from "./subscription-users";

export default function SubscriptionInfo({
  userAmount,
  billingPeriod,
  supportPackage,
}) {
  return (
    <div className="flex gap-2">
      <SubscriptionUsers
        userAmount={userAmount}
        billingPeriod={billingPeriod}
      />
      <SubscriptionSupport supportPackage={supportPackage} />
    </div>
  );
}
