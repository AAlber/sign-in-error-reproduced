import { Settings, User } from "lucide-react";
import type { ScheduleAppointment } from "@/src/types/appointment.types";
import useAppointmentAttendenceModal from "../../popups/appointment-attendence/zustand";
import useAppointmentEditor from "../../popups/appointment-editor/zustand";
import AccessGate from "../../reusable/access-gate";
import { Button } from "../../reusable/shadcn-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../reusable/shadcn-ui/dropdown-menu";
import Spinner from "../../spinner";

export default function Buttons({
  appointment,
}: {
  appointment: ScheduleAppointment;
}) {
  const { initSettings } = useAppointmentEditor();
  const { init } = useAppointmentAttendenceModal();

  return (
    <AccessGate
      layerIds={appointment.appointmentLayers.map((l) => l.layerId)}
      rolesWithAccess={["moderator", "educator"]}
      loaderElement={<Spinner size="w-5 h-5" />}
    >
      <div className="flex items-center -space-x-1">
        <Button
          size={"icon"}
          variant={"ghost"}
          onClick={() => init(appointment)}
        >
          <User className="h-4 w-4" />
        </Button>
        {appointment.seriesId === null ? (
          <Button
            size={"icon"}
            variant={"ghost"}
            onClick={() => initSettings(appointment.id, false, appointment)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                size={"icon"}
                variant={"ghost"}
                onClick={() => init(appointment)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => initSettings(appointment.id, false, appointment)}
              >
                Edit appointment
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => initSettings(appointment.id, true, appointment)}
              >
                Edit appointment series
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </AccessGate>
  );
}
