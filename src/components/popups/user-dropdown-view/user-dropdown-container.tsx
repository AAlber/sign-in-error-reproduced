import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getInstitutionSettingsValues } from "@/src/client-functions/client-institution-settings";
import { getUsersFromLayer } from "@/src/client-functions/client-user-management";
import { useDebounce } from "@/src/client-functions/client-utils/hooks";
import Skeleton from "../../skeleton";
import UsersList from "./users-list";
import useUserDropdownView from "./zustand";

export default function UserDropdownContainer() {
  const { open, layerId, search, users, setUsers, setUserProfilesActive } =
    useUserDropdownView();
  const [loading, setLoading] = useState(true);
  const [loadMore, setLoadMore] = useState(false);
  const { t } = useTranslation("page");

  useEffect(() => {
    if (!open) return;
    getInstitutionSettingsValues(["addon_user_profiles"]).then((settings) => {
      if (settings && settings.addon_user_profiles)
        return setUserProfilesActive(true);
      return setUserProfilesActive(false);
    });
  }, [open]);

  useDebounce(
    () => {
      if (!open) return;
      setLoading(true);
      getUsersFromLayer({
        layerId,
        search,
        take: loadMore ? 20 : 5,
      }).then((res) => {
        setUsers(res);
        setLoading(false);
      });
    },
    [open, search, loadMore],
    400,
  );

  return (
    <div className="max-h-96 w-full overflow-hidden overflow-y-scroll rounded-md border border-border">
      {loading ? (
        <Skeleton />
      ) : (
        <div className="size-full">
          {users.length > 0 && <UsersList users={users} layerId={layerId} />}
          {!loadMore && users.length >= 5 && (
            <div
              onClick={() => setLoadMore(true)}
              className="flex w-full items-center justify-center border-b border-border px-4 py-1 text-sm text-muted-contrast hover:bg-foreground"
            >
              {t("course_members_display_members_search_load_more")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
