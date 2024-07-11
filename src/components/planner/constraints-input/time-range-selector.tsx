import { DatePicker } from "../../reusable/date-time-picker/date-picker";
import { LoadingSparkles } from "../../reusable/loading-sparkles";
import { toast } from "../../reusable/toaster/toast";
import usePlanner from "../zustand";
import { ContraintPreferenceItem } from "./contraint-preference-item";

export default function DateRangeSelector() {
  const { aiLoading, constraints, updateConstraints } = usePlanner();

  const isDateBeforeToDate = (date) => {
    return date.getTime() < new Date(constraints.dateRange.to).getTime();
  };

  const isDateAfterFromDate = (date) => {
    return date.getTime() > new Date(constraints.dateRange.from).getTime();
  };

  const handleUpdateDateRange = (value, type: "from" | "to") => {
    if (type === "from" && !isDateBeforeToDate(value)) {
      return toast.warning("start_date_cannot_be_before", {
        description: "start_date_cannot_be_before_desc",
      });
    } else if (type === "to" && !isDateAfterFromDate(value)) {
      // wrong translation - "due date" should be replaced with "end date"
      // create a new key, since due date makes sence for content blocks, but not for appointments
      return toast.warning("due_date_cannot_be_before", {
        description: "due_date_cannot_be_before_desc",
      });
    } else {
      // bug!!!
      // toast is being displayed, however date is still set in frontend
      updateConstraints({
        dateRange: {
          ...constraints.dateRange,
          [type]: value,
        },
      });
    }
  };

  return (
    <ContraintPreferenceItem
      title="planner_date_range_title"
      description="planner_date_range_description"
    >
      <div className="relative flex w-full flex-col items-center gap-2">
        <div className="relative w-full">
          <LoadingSparkles loading={aiLoading} particleDensity={500} id="date">
            <DatePicker
              smallFormat
              date={constraints.dateRange.from}
              onChange={(value) => handleUpdateDateRange(value, "from")}
            />
          </LoadingSparkles>
        </div>
        <div className="relative w-full">
          <LoadingSparkles loading={aiLoading} particleDensity={500} id="date2">
            <DatePicker
              smallFormat
              date={constraints.dateRange.to}
              onChange={(value) => handleUpdateDateRange(value, "to")}
            />
          </LoadingSparkles>
        </div>
      </div>
    </ContraintPreferenceItem>
  );
}
