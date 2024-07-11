import { useTranslation } from "react-i18next";
import { replaceVariablesInString } from "@/src/client-functions/client-utils";
import { useBilling } from "../../institution-settings/setting-containers/insti-settings-billing/zustand-billing";
import CheckList from "../check-list";

export function InfoListActive({
  includePlanDetails = false,
  newUsers = 0,
}: {
  includePlanDetails?: boolean;
  newUsers?: number;
}) {
  const { t } = useTranslation("page");
  const { totalUsers, subscription } = useBilling();
  const maxUsers = subscription?.quantity || 0;
  const usage = `${totalUsers}/${maxUsers}`;
  const newUsage = `${totalUsers + newUsers}/${maxUsers}`;
  return (
    <CheckList className="text-muted-contrast">
      <CheckList.Item variant="positive" text="can_access_organization" />
      <CheckList.Item variant="positive" text="can_see_assigned_data" />
      <CheckList.Item variant="positive" text="added_to_your_plan" />
      {includePlanDetails && (
        <CheckList.Item
          type="arrow"
          text={replaceVariablesInString(t("usage_compare"), [usage, newUsage])}
        />
      )}
    </CheckList>
  );
}

export function InfoListInactive({
  includePlanDetails = false,
  removedUsers = 0,
}: {
  includePlanDetails?: boolean;
  removedUsers?: number;
}) {
  const { t } = useTranslation("page");
  const { totalUsers, subscription } = useBilling();
  const maxUsers = subscription?.quantity || 0;
  const usage = `${totalUsers}/${maxUsers}`;
  const newUsage = `${totalUsers - removedUsers}/${maxUsers}`;

  return (
    <CheckList className="text-muted-contrast">
      <CheckList.Item
        type="cross"
        variant="negative"
        text="cannot_see_assigned_data"
      />
      <CheckList.Item
        type="cross"
        variant="negative"
        text="cannot_access_organization"
      />
      <CheckList.Item
        type="cross"
        variant="negative"
        text="not_paying_for_user"
      />
      {includePlanDetails && (
        <CheckList.Item
          type="arrow"
          text={replaceVariablesInString(t("usage_compare"), [usage, newUsage])}
        />
      )}
    </CheckList>
  );
}
