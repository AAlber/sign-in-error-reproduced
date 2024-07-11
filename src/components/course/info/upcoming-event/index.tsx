import Skeleton from "../../../skeleton";
import useCourse from "../../zustand";
import AppointmentItem from "./appointment-item";
import NoUpcomingEvents from "./no-appointments";
import useUpcomingAppointments from "./use-upcoming-event-hook";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { Plus } from "lucide-react";
import useAppointmentEditor from "@/src/components/popups/appointment-editor/zustand";

export default function UpcomingEvents() {
  const { hasSpecialRole, course } = useCourse();
  const { isLoading, appointments, nextUp, nextAppointmentRef } =
    useUpcomingAppointments();
  const { init: initAppointmentCreator } = useAppointmentEditor();

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      {isLoading ? (
        <div className="flex flex-col gap-3 px-4">
          {new Array(course.appointmentCount).fill(0).map((_, i) => (
            <div key={i} className="h-14 w-full overflow-hidden rounded-md">
              <Skeleton />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="flex h-full w-full flex-col overflow-y-scroll">
            <div className="flex h-full w-full flex-col gap-3 px-4">
              {!!appointments.length ? (
                <div>
                  {appointments.map((appointment) => {
                    const isNextAppointment = nextUp?.id === appointment.id;
                    return (
                      <AppointmentItem
                        appointments={appointments}
                        key={appointment.id}
                        appointment={appointment}
                        isNextAppointment={isNextAppointment}
                        nextAppointmentRef={nextAppointmentRef}
                      />
                    );
                  })}
                </div>
              ) : (
                <NoUpcomingEvents />
              )}
            </div>
          </div>
        </>
      )}
      {hasSpecialRole && appointments.length > 0 && (
        <Button
          onClick={() => {
            initAppointmentCreator(
              course?.layer_id ? { layerIds: [course?.layer_id] } : undefined,
            );
          }}
          variant={"default"}
          size={"icon"}
          className="fixed bottom-4 right-4"
        >
          <Plus className="text-contrast-muted h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
