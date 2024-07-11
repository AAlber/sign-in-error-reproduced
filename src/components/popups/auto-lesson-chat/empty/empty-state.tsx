import { BotMessageSquare } from "lucide-react";
import { EmptyState } from "@/src/components/reusable/empty-state/empty-state";

export default function AutoLessonEmptyState() {
  return (
    <div className="h-full w-full">
      <EmptyState
        icon={BotMessageSquare}
        title="autlesson_empty_state_title"
        description="autolesso_empty_state_description"
      />
    </div>
  );
}
