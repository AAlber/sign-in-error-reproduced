import { useEffect } from "react";
import api from "@/src/pages/api/api";
import useAppointmentCheckInModal from "./zustand";

/**
 * Mount this hook to a component to start listening
 * for when the ROTATE_QR validity option is selected
 * */

export default function useRotatingQrSse() {
  const { isListening, appointment } = useAppointmentCheckInModal();

  useEffect(() => {
    if (!appointment) return;
    const id = appointment.id;

    let eventSource: EventSource;

    const close = () => {
      eventSource?.close();
      console.log("closing");
    };

    if (isListening) {
      eventSource = new EventSource(`${api.getRotatingQr}?appointmentId=${id}`);

      eventSource.onmessage = (event) => {
        const { setToken, isFetchingToken, setIsFetchingToken } =
          useAppointmentCheckInModal.getState();

        if (isFetchingToken) setIsFetchingToken(false);

        const data = JSON.parse(event.data) as { token: string };
        setToken(data.token);
      };
    }

    return close;
  }, [isListening, appointment]);
}
