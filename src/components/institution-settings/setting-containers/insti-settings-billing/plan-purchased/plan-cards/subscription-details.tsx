import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getAndSetCustomerCompanyNameAndTaxId,
  toggleActiveSubscription,
} from "@/src/client-functions/client-stripe";
import {
  getSubscriptionInfo,
  isTestInstitution,
} from "@/src/client-functions/client-stripe/data-extrapolation";
import { getSupportPackageNameFromValue } from "@/src/client-functions/client-stripe/price-id-manager";
import { subscriptionIsBeingCancelled } from "@/src/client-functions/client-stripe/utils";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { isPartOfFakeTrialInstitutions } from "@/src/utils/functions";
import { PaymentStage, useBilling } from "../../zustand-billing";
import UpgradeSection from "../upgrade-section";
import { useUpgradeModal } from "../zustand";

export default function SubscriptionDetails() {
  const { setUpgradeModalOpen } = useUpgradeModal();
  useEffect(() => {
    getAndSetCustomerCompanyNameAndTaxId();
  }, []);
  const { t } = useTranslation("page");
  const { totalUsers, supportPackage, setPaymentStage } = useBilling();
  const { isBeingCancelled, dateOfNewInvoice } =
    getSubscriptionInfo(totalUsers);
  const [reactivating, setReactivating] = useState(false);
  return (
    <div className="flex h-40 items-center justify-start p-8">
      <div className="flex h-full w-full flex-col items-start text-sm ">
        <p className="text-lg font-semibold">{t("subscription_details")}</p>
        <div className="text-muted-contrast">
          {isBeingCancelled && isTestInstitution()
            ? t("billing_page.plan_card.subtitle3")
            : isBeingCancelled
            ? t("billing_page.plan_card.subtitle1")
            : t("billing_page.plan_card.subtitle2")}{" "}
          <span className="font-medium text-contrast">
            {dayjs(dateOfNewInvoice).format("DD MMM YYYY")}
          </span>
        </div>
        <div className="text-muted-contrast ">
          {supportPackage !== "none" ? (
            <>
              {t("support_package") + ": "}
              <span className="font-medium text-contrast">
                {" " +
                  getSupportPackageNameFromValue(supportPackage)?.replace(
                    "Support",
                    "",
                  )}
              </span>
            </>
          ) : (
            t("no_support_plan")
          )}
        </div>
        {subscriptionIsBeingCancelled() && !isTestInstitution() ? (
          <Button
            className="px-0"
            variant={"link"}
            disabled={reactivating}
            onClick={async () => {
              setReactivating(true);
              await toggleActiveSubscription(subscriptionIsBeingCancelled());
              setReactivating(false);
            }}
          >
            {reactivating
              ? t("reactivating")
              : t("billing_page.plan_reactivate")}
          </Button>
        ) : isTestInstitution() ? (
          <Button
            className="mt-2"
            variant={"cta"}
            onClick={() => setPaymentStage(PaymentStage.NoPlan)}
          >
            {t("create_fuxam_plan")}
          </Button>
        ) : isPartOfFakeTrialInstitutions() ? (
          <></>
        ) : (
          <Button
            className="px-0"
            variant={"link"}
            onClick={() => setUpgradeModalOpen(true)}
          >
            {t("edit_subscription")}
          </Button>
        )}
      </div>

      {!isTestInstitution() && <UpgradeSection />}
    </div>
  );
}
