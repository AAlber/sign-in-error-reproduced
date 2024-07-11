import cuid from "cuid";
import dayjs from "dayjs";
import sample from "lodash/sample";
import usePlanner from "@/src/components/popups/planner/zustand";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import type { ScheduleAppointment } from "@/src/types/appointment.types";
import useSchedule from "../../../zustand";

/** Temporary component, used only for testing! */
export function MockDraftAppointments({
  setContainerRect,
}: {
  setContainerRect: () => void;
}) {
  return (
    <Button
      className="pointer-events-auto absolute -left-4 top-0 z-50 h-10 rounded-md px-2 font-bold text-white"
      variant="destructive"
      onClick={() => {
        setContainerRect();
        const data = Array.from({ length: 5 }).map<ScheduleAppointment>(
          (_, index) => {
            const duration = sample([60, 90, 120, 180])!;
            return {
              id: cuid(),
              address: `Draft - ${index}`,
              appointmentLayers: [],
              dateTime: dayjs()
                .add(2, "hours")
                .set("minute", 0)
                .add(index, "day")
                .toDate(),
              duration,
              isHybrid: false,
              isOnline: true,
              location: null,
              notes: "",
              onlineAddress: "",
              organizerUsers: [],
              appointmentUsers: [],
              appointmentUserGroups: [],
              type: "draft",
              provider: "",
              room: null,
              roomId: null,
              series: null,
              seriesId: null,
              appointmentCreator: null,
              title: `Draft ${index} - Duration: ${duration}`,
            };
          },
        );

        const existing = useSchedule.getState().appointments;
        usePlanner.getState().setDraftAppointments(data);
        useSchedule
          .getState()
          .setAppointments(existing ? [...existing, ...data] : [...data]);
      }}
    >
      Generate Draft
    </Button>
  );
}
