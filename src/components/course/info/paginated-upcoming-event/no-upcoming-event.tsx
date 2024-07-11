import { CalendarOff } from "lucide-react";
import { EmptyState } from "@/src/components/reusable/empty-state/empty-state";

export default function NoUpcomingEventsSchedule() {
  return (
    <div className="py-10">
      <EmptyState
        title="course.empty.schedule"
        description="schedule.empty.description"
        icon={CalendarOff}
      >
        <EmptyState.LearnTrigger triggerId="schedule-learn-menu" />
      </EmptyState>
    </div>
  );
}
