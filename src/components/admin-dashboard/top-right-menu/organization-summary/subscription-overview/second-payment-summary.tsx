import dayjs from "dayjs";
import PaymentBreakdown from "./payment-breakdown";

export default function SecondPaymentSummary({
  userAmount,
  costPerUser,
  totalExcludingTax,
  total,
  billingPeriod,
}) {
  return (
    <div className="mt-2 flex flex-col gap-2 border-t border-border p-2">
      <p className="text-sm text-muted-contrast">
        {"Example Second Payment - " +
          dayjs(new Date())
            .add(1, billingPeriod.replace("ly", "") as "month" | "year")
            .format("DD.MM.YYYY") +
          ":"}
      </p>
      <PaymentBreakdown
        userAmount={userAmount}
        costPerUser={costPerUser}
        totalExcludingTax={totalExcludingTax}
        total={total}
        isFirstPayment={false}
      />
    </div>
  );
}
