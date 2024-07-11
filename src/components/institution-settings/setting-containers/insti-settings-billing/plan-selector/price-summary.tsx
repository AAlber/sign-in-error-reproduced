import { useTranslation } from "react-i18next";
import { getInvoiceInfoFromUserAmount } from "@/src/client-functions/client-stripe/data-extrapolation";
import {
  getSupportPackageInfo,
  getSupportPackageNameFromValue,
} from "@/src/client-functions/client-stripe/price-id-manager";
import { getPlanInformations } from "@/src/client-functions/client-stripe/utils";
import classNames from "@/src/client-functions/client-utils";
import Box from "@/src/components/reusable/box";
import Divider from "@/src/components/reusable/divider";
import Form from "@/src/components/reusable/formlayout";
import { FeatureList } from "@/src/components/reusable/shadcn-ui/support-package-peeker/feature-list";
import { usePlanSelector } from "./zustand";

export const PriceSummary = ({ children }: { children?: React.ReactNode }) => {
  return (
    <Form.FullWidthItem>
      <Box smallPadding>
        <div className="mt-2">{children}</div>
      </Box>
    </Form.FullWidthItem>
  );
};

const Plan = () => {
  const { billingPeriod, userAmount } = usePlanSelector();
  const isMonthly = billingPeriod === "monthly";
  const invoiceInfo = getInvoiceInfoFromUserAmount(isMonthly, userAmount);
  const { t } = useTranslation("page");
  return (
    <div>
      <div className="flex justify-between text-sm text-muted-contrast">
        {invoiceInfo.description.replace("Fuxam Premium ", "")}
        <div>
          {(userAmount === undefined ? 3 : userAmount) +
            " x " +
            invoiceInfo.costPerUser.toString() +
            ".00€"}
        </div>
      </div>
      <div
        className={classNames(
          " flex justify-end break-words text-xs font-normal text-muted-contrast",
        )}
      >
        {`${t("per_user")} / ${billingPeriod}`}
      </div>
    </div>
  );
};

const Support = () => {
  const { supportPackage } = usePlanSelector();
  const info = getSupportPackageInfo(supportPackage);
  const { t } = useTranslation("page");
  return (
    <div>
      <div className="py-2">
        <Divider />
      </div>
      <div className="flex justify-between text-sm text-muted-contrast">
        {getSupportPackageNameFromValue(supportPackage)}
        <div>{t("one-time-payment") + ": " + info?.formattedPrice + "€"}</div>
      </div>
      <div
        className={classNames(
          " mt-2 break-words text-xs font-normal text-muted-contrast",
        )}
      >
        <FeatureList supportPackage={supportPackage} />
      </div>
    </div>
  );
};

const Total = () => {
  const { userAmount, billingPeriod, supportPackage } = usePlanSelector();
  const info = getPlanInformations(userAmount);
  const info2 = getSupportPackageInfo(supportPackage);
  const finalFormattedPrice = (info2?.formattedPrice as string).replace(
    ",",
    "",
  );
  const { t } = useTranslation("page");
  return (
    <div>
      <div className="py-2">
        <Divider />
      </div>
      <div className="flex items-center justify-between font-semibold text-contrast">
        {t("total")}
        <div>
          {userAmount
            ? (
                userAmount *
                  (billingPeriod === "monthly"
                    ? info.monthlyPerUser
                    : info.yearlyPerUser) +
                parseInt(finalFormattedPrice)
              ).toFixed(2) + "€"
            : parseInt(finalFormattedPrice) + ".00€"}
          <div className="flex justify-end text-xs font-normal text-muted-contrast">
            {t("plus_19_tax")}
          </div>
        </div>
      </div>
    </div>
  );
};

Total.displayName = "Total";
Support.displayName = "Support";
Plan.displayName = "Plan";
PriceSummary.displayName = "PriceSummary";
PriceSummary.Plan = Plan;
PriceSummary.Support = Support;
PriceSummary.Total = Total;
