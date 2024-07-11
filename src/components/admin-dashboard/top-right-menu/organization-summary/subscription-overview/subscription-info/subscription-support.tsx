import { MessageCircleQuestion } from "lucide-react";
import { getSupportPackageNameFromValue } from "@/src/client-functions/client-stripe/price-id-manager";

export default function SubscriptionSupport({
  supportPackage,
}: {
  supportPackage: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <MessageCircleQuestion className="size-4 text-muted-contrast" />
      <div className="font-semibold">
        {getSupportPackageNameFromValue(supportPackage)}
      </div>
    </div>
  );
}
