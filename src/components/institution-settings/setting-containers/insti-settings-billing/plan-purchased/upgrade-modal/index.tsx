import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type Stripe from "stripe";
import {
  getUpcomingInvoicePreview,
  runChecksBeforeFinalUpgradeStep,
  runFinalUpgradeStep,
} from "@/src/client-functions/client-stripe";
import {
  canUpgradeInstantly,
  getCheckoutTableData,
  getCostOfInstantUpgradeWithScheduledUpgrade,
  hasDoneInstantUpgradeThisBillingCycle,
} from "@/src/client-functions/client-stripe/data-extrapolation";
import { getPricingModel } from "@/src/client-functions/client-stripe/price-id-manager";
import {
  formatStripeMoney,
  moneyFormatter,
} from "@/src/client-functions/client-stripe/utils";
import { replaceVariablesInString } from "@/src/client-functions/client-utils";
import Box from "@/src/components/reusable/box";
import InfoCard from "@/src/components/reusable/infocard";
import Modal from "@/src/components/reusable/multi-page-modal";
import TickGroup from "@/src/components/reusable/settings-ticks/tick-group";
import TickItem from "@/src/components/reusable/settings-ticks/tick-item";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/reusable/shadcn-ui/accordion";
import CompanyNameEditor from "../../billing-info-editors/company-name";
import TaxIdEditor from "../../billing-info-editors/tax-id";
import PlanSelector from "../../plan-selector";
import { usePlanSelector } from "../../plan-selector/zustand";
import { useBilling } from "../../zustand-billing";
import { useUpgradeModal } from "../zustand";
import AddressEditor from "./address-editor";
import AdvancedOptions from "./advanced-options-menu";
import CheckoutTable from "./checkout-table";
import PaymentMethodDropdown from "./payment-method-dropdown";
import PriceTotals from "./price-summary/price-summary-totals";

export default function UpgradeModal() {
  const { upgradeModalOpen, setUpgradeModalOpen } = useUpgradeModal();
  const { billingPeriod, userAmount, supportPackage, setUserAmount } =
    usePlanSelector();

  const [upcomingInvoicePreview, setUpcomingInvoicePreview] = useState<
    Stripe.UpcomingInvoice | undefined
  >();
  const { subscription } = useBilling();
  const { t } = useTranslation("page");

  const [informationConfirmed, setInformationConfirmed] = useState(false);
  const [termsConfirmed, setTermsConfirmed] = useState(false);

  const isMonthly = billingPeriod === "monthly";
  useEffect(() => {
    if (upgradeModalOpen) {
      setUserAmount(subscription?.quantity || 100);
    }
  }, [upgradeModalOpen]);
  return (
    <Modal
      open={upgradeModalOpen}
      title={"billing_page.upgrade_modal.title"}
      finishButtonText={"billing_page.upgrade_modal.finish_button"}
      onFinish={() => runFinalUpgradeStep()}
      onClose={() => {
        console.log("close");
      }}
      height={"xl"}
      setOpen={setUpgradeModalOpen}
      useTabsInsteadOfSteps={false}
      pages={[
        {
          title: "billing_page.upgrade_modal.step_plan_title",
          tabTitle: "billing_page.upgrade_modal.step_plan_tab_title",
          description: "billing_page.upgrade_modal.step_plan_subtitle",
          nextStepRequirement: () => {
            return userAmount !== undefined && userAmount > 3;
          },
          children: (
            <div className="w-full">
              <PlanSelector>
                <PlanSelector.UserAmountInput />
                <PlanSelector.YearlyMonthlySwitch />
              </PlanSelector>
              <AddressEditor />
              <div className="h-4" />
              <PaymentMethodDropdown />
              <AdvancedOptions />
            </div>
          ),
        },
        {
          title: "billing_page.upgrade_modal.step_details_title",
          tabTitle: "billing_page.upgrade_modal.step_details_tab_title",
          description: "billing_page.upgrade_modal.step_details_subtitle",
          nextStepRequirement: () => true,
          onNextClick: async () => {
            const upcomingInvoice = await getUpcomingInvoicePreview({
              priceId: getPricingModel(userAmount, isMonthly)!,
              quantity: userAmount as number,
              // promoCode,
            });
            setUpcomingInvoicePreview(upcomingInvoice);
            return runChecksBeforeFinalUpgradeStep();
          },
          children: (
            <div>
              <div>
                <h1 className={"mb-2 text-sm text-contrast"}>
                  {t("billing_page.upgrade_modal.step_details_tax_id")}
                </h1>
                <TaxIdEditor />
              </div>
              <div>
                <h1 className="my-2 text-sm text-contrast">
                  {t("billing_page.upgrade_modal.step_details_company_name")}
                </h1>
                <CompanyNameEditor />
              </div>
              {/* <div>
                <h1 className="my-2 text-sm text-contrast">
                  {t("billing_page.upgrade_modal.step_details_promocode")}
                </h1>
                <PromoCodeEditor />
              </div> */}
            </div>
          ),
        },
        {
          title: "billing_page.upgrade_modal.step_checkout_title",
          tabTitle: "billing_page.upgrade_modal.step_checkout_tab_title",
          description: "billing_page.upgrade_modal.step_checkout_subtitle",
          nextStepRequirement: () => informationConfirmed && termsConfirmed,
          children: (
            <div className="flex h-full flex-col">
              {canUpgradeInstantly({
                subscription: subscription!,
                newPrice: getPricingModel(userAmount, isMonthly)!,
                newQuantity: userAmount as number,
              }) ? (
                upcomingInvoicePreview && (
                  <>
                    <InfoCard icon={"⚡️"}>
                      <InfoCard.Title>{t("instant_upgrade")}</InfoCard.Title>
                      <InfoCard.Description>
                        {t("instant_upgrade_explanation")}
                      </InfoCard.Description>
                    </InfoCard>
                    <Accordion type="single" collapsible className="mt-2">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>
                          <div className="flex gap-2">
                            {upcomingInvoicePreview &&
                              `${t("next_invoice_total")} ${formatStripeMoney(
                                upcomingInvoicePreview.total,
                              )}`}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <Box smallPadding>
                            <PriceTotals invoice={upcomingInvoicePreview} />
                          </Box>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2" defaultChecked>
                        <AccordionTrigger>
                          {replaceVariablesInString(
                            t("cost_per_period_after"),
                            [billingPeriod.replace("ly", "")],
                          )}{" "}
                          {"€" +
                            moneyFormatter.format(
                              getCheckoutTableData().costOfNewPlan,
                            )}
                        </AccordionTrigger>
                        <AccordionContent>
                          <CheckoutTable />
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </>
                )
              ) : (
                <div className="pb-4">
                  {hasDoneInstantUpgradeThisBillingCycle() && (
                    <div className="pb-4">
                      <InfoCard icon={"ℹ️"}>
                        <InfoCard.Title>
                          {t("next_invoice_total")}{" "}
                          {getCostOfInstantUpgradeWithScheduledUpgrade()}
                        </InfoCard.Title>
                        <InfoCard.Description>
                          {t("instant_plus_scheduled_upgrade_explanation")}
                        </InfoCard.Description>
                      </InfoCard>
                    </div>
                  )}
                  <CheckoutTable />
                </div>
              )}
              <div className="mt-4">
                <TickGroup>
                  <TickItem
                    checked={informationConfirmed}
                    onChange={() =>
                      setInformationConfirmed(!informationConfirmed)
                    }
                    title={"billing_page.payment_input.tickitem1_title"}
                    link="https://www.fuxam.com/privacy-software"
                    linkName="billing_page.payment_input.tickitem1_link_name"
                  />
                  <TickItem
                    checked={termsConfirmed}
                    onChange={() => setTermsConfirmed(!termsConfirmed)}
                    title={"billing_page.upgrade_input.tickitem3_title"}
                  />
                </TickGroup>
              </div>
            </div>
          ),
        },
      ]}
    />
  );
}
