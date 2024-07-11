import dayjs from "dayjs";
import { getSupportPackageInfo } from "@/src/client-functions/client-stripe/price-id-manager";
import PaymentBreakdown from "./payment-breakdown";

export default function FirstPaymentSummary({
  userAmount,
  costPerUser,
  totalExcludingTax,
  supportPackage,
}: {
  userAmount: number;
  costPerUser: number;
  totalExcludingTax: number;
  supportPackage: string;
}) {
  const supportpackageInfo = getSupportPackageInfo(supportPackage);
  const supportPackagePrice = supportpackageInfo?.formattedPrice;

  return (
    <div className="mt-2 flex flex-col gap-2 border-t border-border p-2">
      <p className="text-sm text-muted-contrast">
        {"Example First Payment - " +
          dayjs(new Date()).format("DD.MM.YYYY") +
          ":"}
      </p>
      <PaymentBreakdown
        userAmount={userAmount}
        costPerUser={costPerUser}
        totalExcludingTax={totalExcludingTax}
        supportPackagePrice={supportPackagePrice}
        isFirstPayment
      />
    </div>
  );
}
