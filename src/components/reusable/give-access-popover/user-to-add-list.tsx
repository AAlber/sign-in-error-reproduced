import { useTranslation } from "react-i18next";
import { getUsersForAddingToLayer } from "@/src/client-functions/client-user-management";
import { useAsyncData } from "@/src/client-functions/client-utils/hooks";
import InviteUserItem from "./user-list-invite-item";
import UserListItem from "./user-list-item";
import UserListItemSkeleton from "./user-list-item-skeleton";
import useGiveAccessPopover from "./zustand";

export default function UsersToAddList() {
  const { t } = useTranslation("page");
  const { search, data, refresh } = useGiveAccessPopover();

  const { data: users, loading } = useAsyncData(
    () =>
      getUsersForAddingToLayer({
        layerId: data.layerId,
        search,
      }),
    search + refresh,
    250,
  );

  return (
    <ul className="flex flex-col gap-2">
      {loading &&
        new Array(3).fill(0).map((_, i) => <UserListItemSkeleton key={i} />)}
      {!loading &&
        users &&
        users.length > 0 &&
        users.map((user) => <UserListItem key={user.id} user={user} />)}
      {!loading && search && users && users.length < 3 && <InviteUserItem />}
      {!loading && !search && users && users.length === 0 && (
        <div className="text-sm text-muted-contrast">
          {t("no_suggestions_no_users")}
        </div>
      )}
    </ul>
  );
}
