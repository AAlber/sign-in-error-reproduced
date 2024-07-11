import AccessGate from "@/src/components/reusable/access-gate";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import Spinner from "@/src/components/spinner";
import type { ScheduleAppointment } from "@/src/types/appointment.types";
import useUser from "@/src/zustand/user";
import { AppointmentOptions } from "./content";

export const AppointmentOptionsDropdown = ({
  appointment,
  children,
}: {
  appointment: ScheduleAppointment;
  children: React.ReactNode;
}) => {
  const { user } = useUser();

  const isCreator = appointment.appointmentCreator?.userId === user.id;
  const isOrganizer = (appointment.organizerUsers ?? []).some(
    (u) => u.organizerId === user.id,
  );
  const isCreatorOrOrganizer = isCreator || isOrganizer;

  if (isCreatorOrOrganizer) {
    return (
      <OptionsDropdown appointment={appointment}>{children}</OptionsDropdown>
    );
  }

  return (
    <AccessGate
      layerIds={[...(appointment.appointmentLayers ?? [])].map(
        (l) => l.layerId,
      )}
      rolesWithAccess={["admin", "moderator", "educator"]}
      loaderElement={<Spinner size="w-5 h-5" />}
    >
      <OptionsDropdown appointment={appointment}>{children}</OptionsDropdown>
    </AccessGate>
  );
};

const OptionsDropdown = ({
  appointment,
  children,
}: {
  appointment: ScheduleAppointment;
  children: React.ReactNode;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <AppointmentOptions appointment={appointment} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
