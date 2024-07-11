import { useTranslation } from "react-i18next";
import DurationSelector from "@/src/components/popups/appointment-editor/appointment-datetime-input/recurrence-options/duration-selector";
import { LoadingSparkles } from "@/src/components/reusable/loading-sparkles";
import usePlanner from "../../zustand";
import { ContraintPreferenceItem } from "../contraint-preference-item";

export default function DurationsSelector() {
  const { t } = useTranslation("page");
  const { aiLoading, constraints, updateConstraints } = usePlanner();

  return (
    <ContraintPreferenceItem
      title="planner_title_duration_title"
      description="planner_title_duration_description"
    >
      <div className="flex items-center justify-end">
        <LoadingSparkles
          loading={aiLoading}
          particleDensity={500}
          id="duration"
        >
          <DurationSelector
            value={constraints.options.duration}
            onChange={(value) =>
              updateConstraints({
                options: {
                  ...constraints.options,
                  duration: value,
                },
              })
            }
          />
        </LoadingSparkles>
      </div>
    </ContraintPreferenceItem>
  );
}
