import { CircleOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getCheckoutTableData } from "@/src/client-functions/client-stripe/data-extrapolation";
import { formatStripeMoney } from "@/src/client-functions/client-stripe/utils";

export default function CheckoutTable() {
  const { t } = useTranslation("page");
  const {
    reductionsExist,
    quantityOfCurrentPlan,
    quantityOfNewPlan,
    isMonthlyCurrentPlan,
    isMonthlyNewPlan,
    costOfCurrentPlan,
    costOfNewPlan,
    monthlyPerUser,
    monthlyPerUserNew,
    yearlyPerUser,
    yearlyPerUserNew,
    oldReduction,
    newReduction,
    oldReductionFormatted,
    newReductionFormatted,
  } = getCheckoutTableData();
  return (
    <>
      <div className="relative h-full w-full">
        <div className="absolute flex h-full w-full items-center justify-between px-20">
          <div className=" dark:opacity- h-32 w-32 rounded-full blur-3xl dark:bg-offwhite-5/80" />
          <div className=" dark:opacity- h-32 w-32 rounded-full blur-3xl dark:bg-offwhite-5/80" />
        </div>
        <div className="flex h-full w-full">
          <div className="milkblur-mid relative h-[250px] w-full max-w-[150px] rounded-l-lg border-y border-l border-border bg-secondary/20 text-muted-contrast">
            <div className="flex h-full w-full flex-col items-start justify-between py-2 pl-3 font-bold text-contrast">
              <h1>{t("billing_page.checkout_table.metrics")}</h1>
              <h1>{t("users")}</h1>
              <h1>{t("billing_page.checkout_table.price_per_user")}</h1>
              {reductionsExist && (
                <h1>{t("billing_page.checkout_table.discount")}</h1>
              )}
              <h1>{t("billing_page.checkout_table.cost_per_month")}</h1>
              <h1>{t("billing_page.checkout_table.cost_per_year")}</h1>
            </div>
          </div>
          <div className="milkblur-mid bg-backgorund/30 relative flex h-[250px] w-full justify-around rounded-r-lg border-y border-r border-border text-contrast">
            <div className="text-text-contrast flex h-full w-auto flex-col items-start justify-between py-2 pl-3">
              <h1>{t("billing_page.checkout_table.old_plan")}</h1>
              <h1>{quantityOfCurrentPlan}</h1>
              <h1>
                {"€" +
                  (isMonthlyCurrentPlan ? monthlyPerUser : yearlyPerUser) +
                  ".00"}{" "}
              </h1>
              {reductionsExist && (
                <h1>
                  {oldReduction ? (
                    oldReductionFormatted
                  ) : (
                    <CircleOff className=" h-6 w-6" />
                  )}
                </h1>
              )}
              <h1>
                {isMonthlyCurrentPlan ? (
                  formatStripeMoney(costOfCurrentPlan)
                ) : (
                  <CircleOff className=" h-6 w-6" />
                )}
              </h1>
              <h1>
                {!isMonthlyCurrentPlan ? (
                  formatStripeMoney(costOfCurrentPlan)
                ) : (
                  <CircleOff className=" h-6 w-6" />
                )}
              </h1>
            </div>
            <div className="flex h-full w-auto flex-col items-start justify-between py-2 pl-3 text-contrast">
              <h1>{t("billing_page.checkout_table.new_plan")}</h1>
              <h1>{quantityOfNewPlan}</h1>
              <h1>
                {"€" +
                  (isMonthlyNewPlan ? monthlyPerUserNew : yearlyPerUserNew) +
                  ".00"}
              </h1>
              {reductionsExist && (
                <h1>
                  {newReduction ? (
                    newReductionFormatted
                  ) : (
                    <CircleOff className=" h-6 w-6" />
                  )}
                </h1>
              )}
              <h1>
                {isMonthlyNewPlan ? (
                  "€" + costOfNewPlan?.toFixed(2)
                ) : (
                  <CircleOff className=" h-6 w-6" />
                )}
              </h1>
              <h1>
                {!isMonthlyNewPlan ? (
                  "€" + costOfNewPlan?.toFixed(2)
                ) : (
                  <CircleOff className=" h-6 w-6" />
                )}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
