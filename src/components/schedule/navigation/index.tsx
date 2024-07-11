import classNames from "@/src/client-functions/client-utils";
import {
  useHandleScheduleDayKeyboardNavigation,
  useHandleScheduleWeekKeyboardNavigation,
} from "../hooks";
import ToolbarItems from "./toolbar-items";

export default function ScheduleToolbar() {
  useHandleScheduleDayKeyboardNavigation();
  useHandleScheduleWeekKeyboardNavigation();
  return (
    <div
      className={classNames(
        "sticky top-0 z-[3] flex items-center rounded-t-md border-none bg-foreground text-xs text-muted-contrast",
      )}
    >
      <div className="w-full">
        <ToolbarItems />
      </div>
    </div>
  );
}
