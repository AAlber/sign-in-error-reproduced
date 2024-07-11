import { useState } from "react";
import { useTranslation } from "react-i18next";
import confirmAction, {
  chooseAction,
} from "@/src/client-functions/client-options-modal";
import { deleteAppointment } from "../../../client-functions/client-appointment";
import { Button } from "../../reusable/shadcn-ui/button";
import useSchedule from "../../schedule/zustand";
import useAppointmentEditor from "./zustand";

export default function AppointmentDeleteButton() {
  const { appointments, setAppointments } = useSchedule();
  const [deleting, setDeleting] = useState(false);
  const { appointmentId, editSeries, reset } = useAppointmentEditor();
  const { t } = useTranslation("page");

  async function del(notifyParticipants: boolean) {
    setDeleting(true);
    const appointmentToBeDeleted = appointments.find(
      (a) => a.id === appointmentId,
    );

    if (appointmentToBeDeleted)
      setAppointments(appointments.filter((a) => a.id !== appointmentId));

    await deleteAppointment(appointmentId, editSeries, notifyParticipants);
    setDeleting(false);
    reset();
  }

  async function confirm() {
    confirmAction(
      async () => {
        setTimeout(() => {
          chooseAction(
            {
              mainAction: async () => del(true),
              secondaryAction: async () => del(false),
              mainActionName: "appointment.delete_chose_action_main",
              secondaryActionName: "appointment.delete_chose_action_secondary",
            },
            {
              title: "appointment.delete_chose_action_title",
              description: "appointment.delete_chose_action_description",
            },
          );
        }, 200);
      },
      {
        title: editSeries
          ? "appointment_modal.delete_series_title"
          : "appointment_modal.delete_title",
        description: "appointment_modal.delete_text",
        actionName: "general.delete",
        dangerousAction: true,
        requiredConfirmationCode: editSeries,
      },
    );
  }

  return (
    <Button onClick={confirm}>
      {t(deleting ? "general.loading" : "general.delete")}
    </Button>
  );
}
