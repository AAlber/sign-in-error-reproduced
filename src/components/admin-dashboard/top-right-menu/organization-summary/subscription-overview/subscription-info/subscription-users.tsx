import { Users } from "lucide-react";

export default function SubscriptionUsers({
  userAmount,
  billingPeriod,
}: {
  userAmount?: number;
  billingPeriod: "monthly" | "yearly";
}) {
  return (
    <div className="flex items-center gap-2">
      <Users className="size-4 text-muted-contrast" />
      <div className="font-semibold">{userAmount + " " + billingPeriod}</div>
    </div>
  );
}
