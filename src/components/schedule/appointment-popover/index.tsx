import { useEffect, useState } from "react";
import { hasRolesWithAccess } from "@/src/client-functions/client-user-management";
import { useAsyncData } from "@/src/client-functions/client-utils/hooks";
import type { ScheduleAppointment } from "@/src/types/appointment.types";
import useUser from "@/src/zustand/user";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../reusable/shadcn-ui/popover";
import { Separator } from "../../reusable/shadcn-ui/separator";
import { useUserOverview } from "../../reusable/user-overview-sheet/zustand";
import useSchedule from "../zustand";
import { AppointmentBasicInfo } from "./appointment-basic-info";
import { AppointmentButtons } from "./appointment-button";
import { AppointmentHeader } from "./appointment-header";
import { AppointmentNotes } from "./appointment-notes";

type Props = {
  appointment: ScheduleAppointment;
  children: React.ReactNode;
  open: boolean;
  setOpen: (bool: boolean) => void;
};

export default function AppointmentPopover({
  appointment,
  children,
  open,
  setOpen,
}: Props) {
  const [canEdit, setCanEdit] = useState(false);
  const { user } = useUser();
  const [selectedAppointmentFromSearch, setSelectedAppointmentFromSearch] =
    useSchedule((state) => [
      state.selectedAppointmentFromSearch,
      state.setSelectedAppointmentFromSearch,
    ]);

  const { loading, data: hasAccess } = useAsyncData(() =>
    hasRolesWithAccess({
      layerIds: appointment.appointmentLayers
        ? appointment.appointmentLayers.map((l) => l.layerId)
        : [],
      rolesWithAccess: ["admin", "moderator", "educator"],
    }),
  );

  useEffect(() => {
    if (loading) {
      setCanEdit(false);
      return;
    }
    if (!loading && hasAccess) setCanEdit(true);
    if (
      (appointment.organizerUsers ?? [])
        .map((u) => u.organizerId)
        .includes(user?.id) ||
      appointment.appointmentCreator?.userId === user?.id
    ) {
      setCanEdit(true);
    }
  }, [loading, hasAccess, appointment]);

  const isViewingFromUserOverview = useUserOverview((state) => state.open);

  return (
    <Popover
      open={open}
      onOpenChange={(e) => {
        if (selectedAppointmentFromSearch?.id === appointment.id) {
          setSelectedAppointmentFromSearch(undefined);
        }

        setOpen(e);
      }}
    >
      <PopoverTrigger asChild id="testt">
        {children}
      </PopoverTrigger>
      <PopoverContent
        onMouseDown={(e) => e.stopPropagation()}
        onMouseMove={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
        autoFocus={false}
        className="w-[325px]"
        align={isViewingFromUserOverview ? "start" : "center"}
        side={"right"}
      >
        <AppointmentHeader
          appointment={appointment}
          showOptions={!isViewingFromUserOverview}
        />
        <Separator />
        <AppointmentBasicInfo appointment={appointment} />
        <AppointmentNotes
          appointment={appointment}
          editable={
            isViewingFromUserOverview ? !isViewingFromUserOverview : canEdit
          }
        />
        {!isViewingFromUserOverview && (
          <AppointmentButtons appointment={appointment} />
        )}
      </PopoverContent>
    </Popover>
  );
}
