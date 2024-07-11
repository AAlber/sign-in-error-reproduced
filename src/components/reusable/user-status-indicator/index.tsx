import cuid from "cuid";
import { AlertTriangleIcon, ChevronsUpDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import classNames from "@/src/client-functions/client-utils";
import type { UserWithAccess } from "@/src/types/user-management.types";
import {
  MINIMUM_COL_SIZE,
  useTableColumn,
} from "../../institution-user-management/data-table/zustand";
import { Popover, PopoverTrigger } from "../shadcn-ui/popover";
import WithToolTip from "../with-tooltip";
import ExtraInfo from "./extra-info";
import { UserStatusPopoverContent } from "./status-info";

export function UserStatusSelector({ user }: { user: UserWithAccess }) {
  const { t } = useTranslation("page");

  const columnSize = useTableColumn((state) => state.tableColumnSize);
  const statusColumnSize = columnSize["--col-status-size"];

  const isUnregistered = cuid.isCuid(user.id);

  const hasPendingInvites =
    isUnregistered &&
    !user.invite?.hasBeenUsed &&
    user.accessState === "active" &&
    user.role !== "admin";

  const hasNoCoursesJoined =
    user.accessState === "active" &&
    typeof user.coursesJoinedCount === "number" &&
    !user.coursesJoinedCount;

  const hasAdminActionRequired =
    isUnregistered || hasPendingInvites || hasNoCoursesJoined;

  const expandExtraInfo =
    hasAdminActionRequired &&
    (statusColumnSize ?? MINIMUM_COL_SIZE) > MINIMUM_COL_SIZE + 6;

  return (
    <Popover>
      <PopoverTrigger
        className={classNames(
          "flex w-full items-center justify-between gap-2",
          !hasAdminActionRequired && "hover:opacity-60",
        )}
      >
        <p
          className={classNames(
            "flex items-center",
            hasAdminActionRequired && !expandExtraInfo ? "gap-3" : "gap-1.5",
          )}
        >
          {user.accessState === "active" ? (
            <>
              <span className="text-positive">{t("active")}</span>
              {hasAdminActionRequired ? (
                expandExtraInfo ? (
                  <p className="text-muted-contrast">
                    (
                    <ExtraInfo
                      inline
                      hasPendingInvites={hasPendingInvites}
                      hasNoCoursesJoined={hasNoCoursesJoined}
                      isUnregistered={isUnregistered}
                    />
                    )
                  </p>
                ) : (
                  <WithToolTip
                    side="right"
                    text=""
                    node={
                      <ExtraInfo
                        inline={false}
                        isUnregistered={isUnregistered}
                        hasNoCoursesJoined={hasNoCoursesJoined}
                        hasPendingInvites={hasPendingInvites}
                      />
                    }
                  >
                    <AlertTriangleIcon className="mb-0.5 h-4 w-4 text-muted-contrast" />
                  </WithToolTip>
                )
              ) : null}
            </>
          ) : (
            <span className="text-muted-contrast">{t("inactive")}</span>
          )}
        </p>
        <ChevronsUpDown className="h-3.5 w-3.5 text-contrast" />
      </PopoverTrigger>
      <UserStatusPopoverContent user={user} />
    </Popover>
  );
}
