import { useTranslation } from "react-i18next";
import UserAccessTable from "./user-overview-tables/user-access-table";
import UserGroupsTable from "./user-overview-tables/user-groups-table";

export default function UserOverviewTable() {
  const { t } = useTranslation("page");

  return (
    <div className="flex h-full flex-col gap-4">
      <h2 className="font-medium">{t("access")}</h2>
      <UserAccessTable />
      <h2 className="font-medium">{t("groups")}</h2>
      <UserGroupsTable />
    </div>
  );
}
