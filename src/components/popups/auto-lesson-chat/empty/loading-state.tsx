import { EmptyState } from "@/src/components/reusable/empty-state/empty-state";
import Spinner from "@/src/components/spinner";

export default function LoadingState() {
  return (
    <div className="h-full w-full">
      <EmptyState
        title="autolesson_loading_state_title"
        description="autolesson_loading_state_description"
      >
        <Spinner size="w-7 h-7 mt-2" />
      </EmptyState>
    </div>
  );
}
