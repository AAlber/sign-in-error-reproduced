import cuid from "cuid";
import { useTranslation } from "react-i18next";
import confirmAction from "@/src/client-functions/client-options-modal";
import { setStatusAndUpdateZustand } from "@/src/client-functions/client-user-management";
import { replaceVariablesInString } from "@/src/client-functions/client-utils";
import {
  CardHeader,
  CardTitle,
} from "@/src/components/reusable/shadcn-ui/card";
import type { UserWithAccess } from "@/src/types/user-management.types";
import { Button } from "../shadcn-ui/button";
import { PopoverContent } from "../shadcn-ui/popover";
import { InfoListActive, InfoListInactive } from "./info-lists";
import PendingInviteIndicator from "./pending-invite";

type Props = { user: UserWithAccess };

export function UserStatusPopoverContent({ user }: Props) {
  const { t } = useTranslation("page");

  const isUnregistered = cuid.isCuid(user.id);

  return (
    <PopoverContent className="flex w-[350px] flex-col gap-2">
      <CardHeader className="flex flex-row items-center justify-between p-0">
        <CardTitle>{user.name}</CardTitle>
        {user.accessState === "active" ? (
          <div className="flex items-center gap-3 text-sm text-positive-contrast">
            <div className="relative flex items-center justify-center">
              <div className="absolute h-1.5 w-1.5 rounded-full bg-positive" />
              <div className="absolute h-1.5 w-1.5 animate-ping-slow rounded-full bg-positive" />
            </div>
            {t("active")}
          </div>
        ) : (
          <div className="flex items-center gap-3 text-sm text-muted-contrast">
            <div className="h-1.5 w-1.5 rounded-full bg-muted-contrast" />
            {t("inactive")}
          </div>
        )}
      </CardHeader>
      {user.accessState === "active" ? (
        <InfoListActive />
      ) : (
        <InfoListInactive />
      )}
      <Button
        variant={user.accessState === "active" ? "default" : "positive"}
        onClick={(event) => {
          event.stopPropagation();
          event.preventDefault();
          const status = user.accessState === "active" ? "inactive" : "active";
          confirmAction(
            () =>
              setStatusAndUpdateZustand(
                [user.id],
                [user.email],
                status === "active",
              ),
            {
              title: replaceVariablesInString(
                t(
                  status === "active" ? "activate_user_x" : "deactivate_user_x",
                ),
                [user.name],
              ),
              description: replaceVariablesInString(
                t(
                  status === "active"
                    ? "activate_user_x_description"
                    : "deactivate_user_x_description",
                ),
                [user.name],
              ),
              actionName: t(status == "active" ? "activate" : "deactivate"),
              displayComponent: () => (
                <>
                  {status === "active" ? (
                    <InfoListActive includePlanDetails newUsers={1} />
                  ) : (
                    <InfoListInactive includePlanDetails removedUsers={1} />
                  )}
                </>
              ),
            },
          );
        }}
        className="mt-2 w-full"
      >
        {replaceVariablesInString(t("set-as-x"), [
          t(
            user.accessState === "active" ? "inactive" : "active",
          ).toLocaleLowerCase(),
        ])}
      </Button>
      {isUnregistered && <PendingInviteIndicator user={user} />}
    </PopoverContent>
  );
}
