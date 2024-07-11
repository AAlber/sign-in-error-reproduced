import { useTranslation } from "react-i18next";
import { getUserGroupsOfInstitution } from "@/src/client-functions/client-institution-user-groups";
import { useAsyncData } from "@/src/client-functions/client-utils/hooks";
import { Input } from "../shadcn-ui/input";
import GroupListItem from "./group-list-item";
import UserListItemSkeleton from "./user-list-item-skeleton";
import useGiveAccessPopover from "./zustand";

export default function GroupsTab() {
  const { t } = useTranslation("page");
  const { search, setSearch, refresh } = useGiveAccessPopover();

  const { data: groups, loading } = useAsyncData(
    () => getUserGroupsOfInstitution(search),
    search + refresh,
    250,
  );

  // we need scroll or something here

  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder={t("general.search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <ul className="flex flex-col gap-2">
        {loading &&
          new Array(3).fill(0).map((_, i) => <UserListItemSkeleton key={i} />)}
        {!loading &&
          groups &&
          groups.length > 0 &&
          groups.map((group) => <GroupListItem key={group.id} group={group} />)}
        {!loading && groups && groups.length === 0 && (
          <div className="flex items-center justify-center py-16 text-center text-sm text-muted-contrast">
            {t("no_groups")}
          </div>
        )}
      </ul>
    </div>
  );
}
