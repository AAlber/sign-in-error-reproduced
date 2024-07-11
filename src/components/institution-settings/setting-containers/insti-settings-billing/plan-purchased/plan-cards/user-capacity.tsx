import { useTranslation } from "react-i18next";
import {
  getSubscriptionInfo,
  isTestInstitution,
} from "@/src/client-functions/client-stripe/data-extrapolation";
import { useBilling } from "../../zustand-billing";

export function UserCapacity() {
  const { t } = useTranslation("page");
  const { totalUsers } = useBilling();
  const { selectedQuantity } = getSubscriptionInfo(totalUsers);
  return (
    <div className="hidden h-40 items-center justify-start p-10 xl:flex">
      {" "}
      <div>
        <p className="font-semibold">{t("user_capacity")}</p>
        <p className="text-5xl font-bold">
          {totalUsers}/{selectedQuantity}
        </p>
        <p className="text-sm text-muted-contrast">
          {isTestInstitution()
            ? t("edit_create_plan_to_select")
            : t("edit_subscription_to_adjust")}
        </p>
      </div>
    </div>
  );
}
