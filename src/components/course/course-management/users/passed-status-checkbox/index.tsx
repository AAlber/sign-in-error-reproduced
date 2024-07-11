import { useEffect, useState } from "react";
import { Checkbox } from "@/src/components/reusable/shadcn-ui/checkbox";
import {
  Popover,
  PopoverTrigger,
} from "@/src/components/reusable/shadcn-ui/popover";
import WithToolTip from "@/src/components/reusable/with-tooltip";
import StatusEditorPopover from "./status-editor-popover";
import useUserStatusCheckbox from "./zustand";

export default function PassedStatusCheckbox({
  courseMember,
}: {
  courseMember: CourseMember;
}) {
  const [open, setOpen] = useState(false);
  const { setMode, setNotes } = useUserStatusCheckbox();

  useEffect(() => {
    if (courseMember.overwrittenStatus) {
      setMode(courseMember.overwrittenStatus.passed ? "passed" : "failed");
      setNotes(courseMember.overwrittenStatus.notes || "");
    } else {
      setMode("automatic");
    }
  }, [open]);

  const automatic = courseMember.overwrittenStatus === undefined;
  const automaticPassed =
    courseMember.attendanceStatus.isRateSufficient &&
    courseMember.prerequisitesStatus
      .map((p) => p.status)
      .every((p) => p === "passed");

  const passed =
    (courseMember.overwrittenStatus && courseMember.overwrittenStatus.passed) ||
    (!courseMember.overwrittenStatus && automaticPassed);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <WithToolTip
          text={
            automatic
              ? passed
                ? "automatic_passed_help_hover"
                : "automatic_failed_help_hover"
              : passed
              ? "passed_help_hover"
              : "failed_help_hover"
          }
        >
          <Checkbox
            className="pointer-events-none"
            variant={passed ? "positive" : automatic ? "muted" : "destructive"}
            icon={passed ? "check" : "cross"}
            checked={true}
          />
        </WithToolTip>
      </PopoverTrigger>
      <StatusEditorPopover courseMember={courseMember} />
    </Popover>
  );
}
