import { Ban, Check, User } from "lucide-react";
import classNames from "@/src/client-functions/client-utils";

export default function RoomOption({
  room,
  isAvailable,
  showAvailabilityIndicator,
}: {
  room: any;
  isAvailable: boolean;
  showAvailabilityIndicator: boolean;
}) {
  return (
    <div className="flex w-full items-center justify-start gap-3">
      <div className="flex items-center gap-3 text-contrast">
        {showAvailabilityIndicator &&
          (isAvailable ? (
            <Check size={14} className={classNames("w-5 text-positive")} />
          ) : (
            <Ban size={14} className={classNames("w-5 text-destructive")} />
          ))}
        <span
          className={classNames(
            !isAvailable ? "text-muted-contrast" : "text-contrast",
          )}
        >
          {room.name}
        </span>
      </div>
      <span className="flex items-center gap-1 text-sm font-normal text-muted-contrast">
        <User size={16} />
        {room.personCapacity >= 100 ? "100+" : room.personCapacity}
      </span>
    </div>
  );
}

export function RoomSelection({ room }: { room: any }) {
  return (
    <div className="flex w-full items-center justify-start gap-3">
      <div className="flex items-center gap-3 font-medium text-contrast">
        {room.name}
      </div>
      <span className="flex items-center gap-1 text-sm font-normal text-muted-contrast">
        <User size={16} />

        {room.personCapacity >= 100 ? "100+" : room.personCapacity}
      </span>
    </div>
  );
}
