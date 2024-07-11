import { ChevronsUpDownIcon } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import classNames from "@/src/client-functions/client-utils";
import type { BlockStatus as BlockStatusType } from "@/src/utils/content-block-status";
import { blockStatus } from "@/src/utils/content-block-status";

type Props = {
  status: BlockStatusType;
} & React.ComponentPropsWithoutRef<"div">;

const BlockStatusTrigger = React.forwardRef<HTMLDivElement, Props>(
  ({ status, className: _className, ...props }, ref) => {
    const { t } = useTranslation("page");
    const statusName = blockStatus.find((i) => i.identifier === status)?.name;

    return (
      <div
        ref={ref}
        {...props}
        className={classNames(
          "flex w-full cursor-pointer items-center justify-between px-2 hover:opacity-60",
          status === "DISABLED"
            ? "text-destructive"
            : status === "COMING_SOON"
            ? "text-muted-contrast"
            : status === "DRAFT"
            ? "text-muted-contrast"
            : "text-enabled",
        )}
      >
        <span>{t(statusName ?? "")}</span>
        <ChevronsUpDownIcon className="h-3.5 w-3.5" />
      </div>
    );
  },
);

BlockStatusTrigger.displayName = "Block Status Trigger";
export default BlockStatusTrigger;
