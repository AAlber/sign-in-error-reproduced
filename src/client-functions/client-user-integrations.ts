import type { UserAppointmentInvitationEmail } from "@prisma/client";
import { toast } from "../components/reusable/toaster/toast";
import api from "../pages/api/api";

export const getAppointmentInvitationEmails = async () => {
  const response = await fetch(api.getAppointmentInvitationEmails, {
    method: "GET",
  });
  if (!response.ok) {
    return null;
  }
  const data = await response.json();
  return data as UserAppointmentInvitationEmail | null;
};

export const connectAppointmentInvitationEmail = async (email: string) => {
  const response = toast.transaction({
    transaction: () =>
      fetch(api.connectAppointmentInvitationEmail, {
        method: "POST",
        body: JSON.stringify({ email }),
      }),
    processMessage: "toast_user_appointment_email_process",
    successMessage: "toast_user_appointment_email_success",
    errorMessage: "toast_user_appointment_email_error",
  });

  return response;
};

export const deleteAppointmentInvitationEmail = async () => {
  const response = toast.transaction({
    transaction: () =>
      fetch(api.deleteAppointmentInvitationEmail, {
        method: "DELETE",
      }),
    processMessage: "toast_user_appointment_email_process",
    successMessage: "toast_user_appointment_email_success",
    errorMessage: "toast_user_appointment_email_error",
  });

  return response;
};
