import { AddButton } from "./add-button";
import DragHandle from "./drag-handle";
import { RemoveButton } from "./remove-button";

export default function Buttons(props: { id: string; isInTheStore: boolean }) {
  return (
    <div className="absolute z-50 -mr-2 -mt-3 flex items-center justify-center gap-1 rounded-lg border border-border bg-card p-1 text-contrast ">
      <DragHandle {...props} />
      {props.isInTheStore ? (
        <AddButton id={props.id} />
      ) : (
        <RemoveButton id={props.id} />
      )}
    </div>
  );
}
