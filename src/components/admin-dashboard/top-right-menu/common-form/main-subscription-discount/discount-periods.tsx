import { useTranslation } from "react-i18next";
import classNames from "@/src/client-functions/client-utils";
import { Label } from "@/src/components/reusable/shadcn-ui/label";

export default function MainSubscriptionDiscount({
  discountEnabled,
  setDiscountEnabled,
}: {
  discountEnabled: boolean;
  setDiscountEnabled: (val: boolean) => void;
}) {
  const { t } = useTranslation("page");
  return (
    <>
      <div className="grid grid-cols-3">
        <Label
          htmlFor="theme-selector"
          className={classNames(
            "block text-sm font-medium",
            discountEnabled ? "text-muted-contrast" : "text-contrast",
          )}
        >
          {t("Main Subscription Discount")}
        </Label>
        <div className={classNames("col-span-2 flex justify-end")}>Nu</div>
      </div>
    </>
  );
}
