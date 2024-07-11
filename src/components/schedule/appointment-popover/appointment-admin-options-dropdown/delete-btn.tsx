import { Trash } from "lucide-react";
import { useTranslation } from "react-i18next";
import { deleteAppointment } from "@/src/client-functions/client-appointment";
import confirmAction, {
  chooseAction,
} from "@/src/client-functions/client-options-modal";
import useAppointmentEditor from "@/src/components/popups/appointment-editor/zustand";
import { DropdownMenuItem } from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import useSchedule from "../../zustand";

export const AppointmentAdminOptionsDropdownDelete = ({
  appointmentId,
  editSeries,
}: {
  appointmentId: string;
  editSeries?: boolean;
}) => {
  const { appointments, setAppointments } = useSchedule();
  const { reset } = useAppointmentEditor();
  const { t } = useTranslation("page");
  async function del(notifyParticipants: boolean) {
    const appointmentToBeDeleted = appointmentId;

    if (appointmentToBeDeleted)
      setAppointments(appointments.filter((a) => a.id !== appointmentId));

    await deleteAppointment(appointmentId, editSeries!, notifyParticipants);
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
        description: editSeries
          ? "appointment_modal.delete_series_text"
          : "appointment_modal.delete_text",
        actionName: "general.delete",
        dangerousAction: true,
        requiredConfirmationCode: editSeries,
      },
    );
  }
  return (
    <DropdownMenuItem
      key="delete"
      onClick={() => confirm()}
      className="!text-destructive"
    >
      <Trash className="h-4 w-4" />
      {t(
        editSeries
          ? "appointment.popover.dropdown.delete_series"
          : "general.delete",
      )}
    </DropdownMenuItem>
  );
};
