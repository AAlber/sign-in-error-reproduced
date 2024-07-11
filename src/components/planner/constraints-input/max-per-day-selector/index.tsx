import { LoadingSparkles } from "@/src/components/reusable/loading-sparkles";
import { Input } from "@/src/components/reusable/shadcn-ui/input";
import usePlanner from "../../zustand";
import { ContraintPreferenceItem } from "../contraint-preference-item";

export default function MaxPerDaySelector() {
  const { aiLoading, constraints, updateConstraints } = usePlanner();

  const handleUpdateConstraints = (e) => {
    // parse number
    const quantity = parseInt(e.target.value, 10);
    // update constraints
    updateConstraints({
      options: {
        ...constraints.options,
        maxAppointmentsPerDay: quantity,
      },
    });
  };

  return (
    <ContraintPreferenceItem
      title="planner_title_max_per_day_title"
      description="planner_title_max_per_day_description"
    >
      <div className="flex items-center justify-end">
        <LoadingSparkles
          loading={aiLoading}
          particleDensity={500}
          id="max-per-day"
        >
          <Input
            type="number"
            value={constraints.options.maxAppointmentsPerDay}
            onChange={handleUpdateConstraints}
          />
        </LoadingSparkles>
      </div>
    </ContraintPreferenceItem>
  );
}
