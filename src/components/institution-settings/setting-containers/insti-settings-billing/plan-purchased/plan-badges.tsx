import { useTranslation } from "react-i18next";
import {
  getPlanChanges,
  getSubscriptionInfo,
  isTestInstitution,
} from "@/src/client-functions/client-stripe/data-extrapolation";
import { replaceVariablesInString } from "@/src/client-functions/client-utils";
import InfoCard from "@/src/components/reusable/infocard";

export default function PlanBadges(props: { totalUsers: number }) {
  const {
    isBeingCancelled,
    isOverLimit,
    hasReachedLimit,
    isCloserThan10PercentToLimit,
  } = getSubscriptionInfo(props.totalUsers);
  const { hasPlanChanged, futureQuantity, updateIsMonthly } = getPlanChanges();

  const { t } = useTranslation("page");
  const billingPeriodText = updateIsMonthly ? t("monthly") : t("yearly");
  return (
    <>
      {isBeingCancelled && !isTestInstitution() && (
        <InfoCard icon={"😓"} className="m-6" variant="destructive">
          <InfoCard.Title>
            {t("billing_page.plan_badges.premium_title")}
          </InfoCard.Title>
          <InfoCard.Description>
            {t("billing_page.plan_badges.premium_subtitle")}
          </InfoCard.Description>
        </InfoCard>
      )}
      {hasPlanChanged && (
        <InfoCard className="m-6" variant="positive" icon={"✅"}>
          <InfoCard.Title>
            {t("billing_page.plan_badges.scheduled_title")}
          </InfoCard.Title>
          <InfoCard.Description>
            {replaceVariablesInString(
              t("billing_page.plan_badges.scheduled_subtitle1"),
              [billingPeriodText, futureQuantity!],
            )}
          </InfoCard.Description>
        </InfoCard>
      )}
      {isOverLimit && !isBeingCancelled && (
        <InfoCard className="m-6" icon={"⚠️"} variant="warning">
          <InfoCard.Title>
            {t("billing_page.plan_badges.surpassed_title")}
          </InfoCard.Title>
          <InfoCard.Description>
            {t("billing_page.plan_badges.surpassed_subtitle")}
          </InfoCard.Description>
        </InfoCard>
      )}
      {hasReachedLimit && !isBeingCancelled && (
        <InfoCard className="m-6" icon={"⚠️"} variant="warning">
          <InfoCard.Title>
            {t("billing_page.plan_badges.reached_title")}
          </InfoCard.Title>
          <InfoCard.Description>
            {t("billing_page.plan_badges.reached_subtitle")}
          </InfoCard.Description>
        </InfoCard>
      )}
      {isCloserThan10PercentToLimit && !isBeingCancelled && (
        <InfoCard className="m-6" icon={"⚠️"} variant="destructive">
          <InfoCard.Title>
            {t("billing_page.plan_badges.closer_title")}
          </InfoCard.Title>
          <InfoCard.Description>
            {t("billing_page.plan_badges.closer_subtitle")}
          </InfoCard.Description>
        </InfoCard>
      )}
    </>
  );
}
