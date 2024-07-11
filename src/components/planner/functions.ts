import { track } from "@vercel/analytics";
import cuid from "cuid";
import { zonedTimeToUtc } from "date-fns-tz";
import { createAppointment } from "@/src/client-functions/client-appointment";
import { selectCurrentWeek } from "@/src/client-functions/client-schedule";
import type { ScheduleAppointment } from "@/src/types/appointment.types";
import type { PlannerLayerWithAvailableResources } from "@/src/types/planner/planner.types";
import useAppointmentEditor from "../popups/appointment-editor/zustand";
import useSchedule from "../schedule/zustand";
import usePlanner from "./zustand";

const setAppointmentEditorState = (appointment: ScheduleAppointment) => {
  const dateTimeUtc = zonedTimeToUtc(
    appointment.dateTime,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );

  useAppointmentEditor.setState({
    title: appointment.title,
    dateTime: dateTimeUtc,
    duration: String(appointment.duration),
    isOnline: appointment.isOnline,
    isHybrid: false,
    address: "",
    onlineAddress: appointment.onlineAddress,
    provider: "custom",
    roomId: appointment.roomId || undefined,
    layerIds: appointment.appointmentLayers.map((a) => a.layer.id),
    organizerIds: appointment.organizerUsers.map(
      (organizer) => organizer.organizerId,
    ),
  });
};

export async function acceptDraftAppointment(appointment: ScheduleAppointment) {
  const { setAppointments, appointments } = useSchedule.getState();
  const { draftAppointments, setDraftAppointments } = usePlanner.getState();
  setAppointmentEditorState(appointment);
  setDraftAppointments(
    draftAppointments.filter((a) => a.id !== appointment.id),
  );
  setTimeout(() => {
    setAppointments([
      ...appointments.filter((a) => a.id !== appointment.id),
      { ...appointment, type: "appointment", id: cuid() },
    ]);
  }, 0);
  track("Accepted Draft Appointment");
  await createAppointment(false);
}

function acceptDraftAppointments(appointments: ScheduleAppointment[]) {
  const { setAppointments, appointments: currentAppointments } =
    useSchedule.getState();
  const { draftAppointments, setDraftAppointments } = usePlanner.getState();

  const newAppointments = appointments.map((appointment) => {
    return {
      ...appointment,
      type: "appointment" as "draft" | "appointment",
      id: cuid(),
    };
  });
  setDraftAppointments(
    draftAppointments.filter((a) => !appointments.some((b) => a.id === b.id)),
  );
  setAppointments([...currentAppointments, ...newAppointments]);
  track("Accepted Draft Appointments");
}

export function declineDraftAppointment(appointment: ScheduleAppointment) {
  const { draftAppointments, setDraftAppointments } = usePlanner.getState();
  setDraftAppointments(
    draftAppointments.filter((a) => a.id !== appointment.id),
  );
}

export function goToDraftAppointment(appointment: ScheduleAppointment) {
  const { setSelectedDay, setShouldScrollToExactTime } = useSchedule.getState();
  const date = new Date(appointment.dateTime);
  setSelectedDay(date);
  selectCurrentWeek(date);
  setShouldScrollToExactTime(true);
}

export function acceptAllDraftAppointments() {
  const { draftAppointments } = usePlanner.getState();
  track("Accepted All Draft Appointment");
  acceptDraftAppointments(draftAppointments);
  draftAppointments.forEach(async (appointment) => {
    setAppointmentEditorState(appointment);
    await createAppointment(false);
  });
}

export function declineAllDraftAppointments() {
  const { draftAppointments } = usePlanner.getState();
  draftAppointments.forEach((appointment) =>
    declineDraftAppointment(appointment),
  );
}

export function makeAllAppointmentsOnline() {
  const { updateConstraints, updateTimeSlot, constraints } =
    usePlanner.getState();
  updateConstraints({
    options: {
      ...constraints.options,
      type: "online",
    },
  });
  constraints.availableTimeSlots.forEach((timeSlot, index) => {
    if (timeSlot.mode !== "use-custom-options") return;
    updateTimeSlot(index, {
      ...timeSlot,
      options: {
        ...timeSlot.options,
        type: "online",
      },
    });
  });
}

export function canHaveOfflineAppointments(
  layers: PlannerLayerWithAvailableResources[],
) {
  return layers.every((layer) =>
    layer.resources.some((resource) => resource.type === "room"),
  );
}

export function isConstraintsEnabled(
  layers: PlannerLayerWithAvailableResources[],
) {
  return (
    layers.length === 0 ||
    !layers.every(
      (l) =>
        l.resources.length > 0 &&
        l.resources.some((r) => r.type === "organizer"),
    )
  );
}

export function getConstraintDisabledCause(
  layers: PlannerLayerWithAvailableResources[],
) {
  return layers.length === 0
    ? "planner.constrains-disabled-1"
    : "planner.constrains-disabled-2";
}

export function verifyAllLayersHaveRoom(
  layers: PlannerLayerWithAvailableResources[],
) {
  return layers.every((layer) =>
    layer.resources.some((resource) => resource.type === "room"),
  );
}
