import cuid from "cuid";
import { useEffect, useState } from "react";
import { getInvoiceInfoFromUserAmount } from "@/src/client-functions/client-stripe/data-extrapolation";
import DefaultPlanSelector from "@/src/components/institution-settings/setting-containers/insti-settings-billing/plan-selector/default-plan-selector";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/reusable/shadcn-ui/accordion";
import { usePlanSelector } from "../../../../institution-settings/setting-containers/insti-settings-billing/plan-selector/zustand";
import { useDiscountCreator } from "../../common-form/main-subscription-discount/zustand";
import type { InstitutionCreatorType } from "../../zustand";
import FirstPaymentSummary from "../subscription-overview/first-payment-summary";
import SecondPaymentSummary from "../subscription-overview/second-payment-summary";
import SubscriptionInfo from "../subscription-overview/subscription-info/subscription-info";

export default function SubscriptionOverview({
  creatorType,
}: InstitutionCreatorType) {
  const { userAmount, billingPeriod, supportPackage } = usePlanSelector();
  const { percentOff, amountOff, setPercentOff, setAmountOff } =
    useDiscountCreator();

  const { costPerUser, total, totalExcludingTax } =
    getInvoiceInfoFromUserAmount(billingPeriod === "monthly", userAmount);
  const [key, setKey] = useState(cuid());
  useEffect(() => {
    if (amountOff !== undefined && percentOff !== undefined) {
      setPercentOff(undefined);
      setKey(cuid());
    }
  }, [amountOff]);

  useEffect(() => {
    if (percentOff !== undefined && amountOff !== undefined) {
      setAmountOff(undefined);
      setKey(cuid());
    }
  }, [percentOff]);

  return (
    <div key={key}>
      <div className="mt-4 text-lg font-semibold">
        {creatorType === "create-organization"
          ? "Subscription Example"
          : "Subscription"}
      </div>
      <SubscriptionInfo
        userAmount={userAmount}
        billingPeriod={billingPeriod}
        supportPackage={supportPackage}
      />
      <FirstPaymentSummary
        userAmount={userAmount || 3}
        costPerUser={costPerUser}
        totalExcludingTax={totalExcludingTax}
        supportPackage={supportPackage}
      />
      <SecondPaymentSummary
        userAmount={userAmount}
        costPerUser={costPerUser}
        totalExcludingTax={totalExcludingTax}
        total={total}
        billingPeriod={billingPeriod}
      />
      {creatorType === "create-organization" && (
        <Accordion type="single" collapsible>
          <AccordionItem
            value={"Preview Editor"}
            key={"Preview Editor"}
            className="border-0"
          >
            <AccordionTrigger
              className="flex gap-2 border-0 border-border px-4 data-[state=open]:!border-b"
              value={"Preview Editor"}
            >
              {"Preview Editor"}{" "}
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-4">
              <div className="mb-2 font-semibold">
                WICHTIG{" "}
                <span className="text-xs text-muted-contrast">
                  {" "}
                  Kunden können immer noch selbst aussuchen wie viele nutzer sie
                  dann haben. Es geht hier nur um die VIsualisierung des
                  Gutscheins.{" "}
                </span>
              </div>
              <div className="rounded-md border border-border p-2">
                <DefaultPlanSelector />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
}
