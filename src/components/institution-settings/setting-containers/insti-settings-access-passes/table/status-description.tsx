import classNames from "@/src/client-functions/client-utils";
import WithToolTip from "@/src/components/reusable/with-tooltip";
import type { AccessPassStatusInfo } from "@/src/utils/stripe-types";

export const statusColors = {
  active: "text-fuxam-green bg-fuxam-green/10",
  // draft: "text-purple-400 bg-purple-400/10",
  expired: "text-destructive bg-destructive/10", // THIS NEEDS TO BE FIXED
};

export default function StatusColors({ info }: { info: AccessPassStatusInfo }) {
  const status = info.status === "canceled" ? "expired" : info.status;
  return (
    <WithToolTip text={status || "draft"}>
      <div
        className={classNames(
          statusColors[status || "draft"],
          "mt-1 h-[14px] w-3.5 flex-none rounded-full p-1",
        )}
      >
        <div className="h-1.5 w-1.5 rounded-full bg-current" />
      </div>
    </WithToolTip>
  );
}
