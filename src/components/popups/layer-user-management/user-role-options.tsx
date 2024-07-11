import { useTranslation } from "react-i18next";
import confirmAction from "@/src/client-functions/client-options-modal";
import classNames from "@/src/client-functions/client-utils";
import type { UserWithAccess } from "@/src/types/user-management.types";
import {
  createRole,
  removeRole,
} from "../../../client-functions/client-user-management";
import useUser from "../../../zustand/user";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
} from "../../reusable/shadcn-ui/select";
import WithToolTip from "../../reusable/with-tooltip";
import useUserLayerManagement from "./zustand";

export default function UserManagementOptions({
  user,
  layerId,
}: {
  user: UserWithAccess;
  layerId: string;
}) {
  const { users, setUsers } = useUserLayerManagement();
  const { user: data } = useUser();
  const { t } = useTranslation("page");

  if (user.id === data.id) return null;

  if (user.accessLevel === "parent-access")
    return (
      <WithToolTip text="parent_access_help">
        <p className="text-muted-contrast">{t("parent_access")}</p>
      </WithToolTip>
    );

  if (user.accessLevel === "partial-access")
    return (
      <WithToolTip text="parent_access_help">
        <p className="text-muted-contrast">{t("partial-access")}</p>
      </WithToolTip>
    );

  return (
    <Select
      value={user.role}
      onValueChange={async (value) => {
        const option = value as Role | "remove-access";
        if (option === "remove-access") {
          confirmAction(
            async () => {
              setUsers(users.filter((u) => u.id !== user.id));
              const success = await removeRole({ userId: user.id, layerId });
              if (!success) return setUsers(users);
            },
            {
              title: `admin_dashboard.confirm_action_remove_user_title`,
              description: `admin_dashboard.confirm_action_remove_user_description`,
              actionName: "admin_dashboard.confirm_action_remove_user_action",
              dangerousAction: true,
            },
          );
          return;
        }

        setUsers(
          users.map((u) => {
            if (u.id === user.id) return { ...u, role: value as Role };
            return u;
          }),
        );
        const success = await createRole({
          userId: user.id,
          layerId,
          role: value as Role,
        });

        if (!success) return setUsers(users);
      }}
    >
      <SelectTrigger
        className={classNames(
          "h-6 border-0 bg-transparent px-0 py-1 text-muted-contrast hover:opacity-60",
        )}
      >
        {t(user.accessState === "active" ? user.role : user.accessState)}
      </SelectTrigger>
      <SelectContent className="w-60">
        {user.accessState === "active" ? (
          <>
            <SelectItem value={"moderator" as Role}>
              <div className="flex flex-col">
                {t("moderator")}
                <span className="text-xs text-muted-contrast">
                  {t("moderator.description")}
                </span>
              </div>
            </SelectItem>
            <SelectItem value={"educator" as Role}>
              <div className="flex flex-col">
                {t("educator")}
                <span className="text-xs text-muted-contrast">
                  {t("educator.description")}
                </span>
              </div>
            </SelectItem>
            <SelectItem value={"member" as Role}>
              <div className="flex flex-col">
                {t("member")}
                <span className="text-xs text-muted-contrast">
                  {t("member.description")}
                </span>
              </div>
            </SelectItem>
          </>
        ) : (
          <SelectItem disabled value={"inactive"}>
            <div className="flex flex-col text-contrast">
              {t(user.accessState)}
              <span className="text-xs text-muted-contrast">
                {t(
                  user.accessState === "inactive"
                    ? "inactive_description"
                    : "hasnt_signed_up_description",
                )}
              </span>
            </div>
          </SelectItem>
        )}
        <SelectSeparator />
        <SelectItem value={"remove-access"}>
          <div className="flex flex-col text-destructive">
            {t("general.remove")}
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
