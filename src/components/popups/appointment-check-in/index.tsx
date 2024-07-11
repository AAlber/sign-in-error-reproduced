/* eslint-disable tailwindcss/migration-from-tailwind-2 */
import dayjs from "dayjs";
import { FileDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getAttendenceKey } from "@/src/client-functions/client-appointment-attendence";
import { replaceVariablesInString } from "@/src/client-functions/client-utils";
import { useAsyncData } from "@/src/client-functions/client-utils/hooks";
import useUser from "@/src/zustand/user";
import Modal from "../../reusable/modal";
import QrCodeComponent from "../../reusable/qr-code";
import CountdownIndicator from "./countdown-indicator";
import ExpirySelector from "./expiry-selector";
import useRotatingQrSse from "./useRotatingQrSse";
import useAppointmentCheckInModal from "./zustand";

export default function AppointmentCheckInModal() {
  const {
    appointment,
    checkInUrl,
    isFetchingToken,
    key,
    open,
    isListening,
    setCheckInUrl,
    setKey,
    setOpen,
    setIsListening,
    token,
  } = useAppointmentCheckInModal();
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useUser();
  const { t } = useTranslation("page");
  const expiryMs = 15000;

  dayjs.locale(user.language);

  // hook that listens for when ROTATING_QR validity option is selected
  useRotatingQrSse();

  useAsyncData(
    async () => {
      try {
        setLoading(true);
        const k = await getAttendenceKey(appointment.id);
        if (!k) return;

        setKey(k);
        if (k.validity === "ROTATING_QR") {
          setIsListening(true);
          return;
        }
      } finally {
        setLoading(false);
      }
    },
    undefined,
    undefined,
    open,
  );

  useEffect(() => {
    if (!appointment) return;
    const appointmentData = {
      id: appointment.id,
      title: appointment.title,
      dateTime: appointment.dateTime,
    };

    const url =
      !!token && isListening
        ? `${window.location.origin}/attendence-check-in?token=${token}`
        : `${
            window.location.origin
          }/attendence-check-in?appointmentData=${encodeURIComponent(
            JSON.stringify(appointmentData),
          )}&key=${key?.id}`;

    setCheckInUrl(url);
  }, [token, key, isListening]);

  const printQrCode = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(
      "<html><head><title>Print QR Code</title></head><body>",
    );
    printWindow.document.write(
      "<div style='display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif'>",
    );
    printWindow.document.write(
      document.querySelector(".aspect-square")!.outerHTML,
    ); // assuming .aspect-square contains the QR code
    printWindow.document.write("</div>");
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  if (!appointment) return null;
  return (
    <Modal noCloseButton open={open} setOpen={setOpen} size="xs">
      <div className="flex flex-col gap-4">
        <div className="border-standard group relative size-full overflow-hidden rounded-md border">
          {!isListening && (
            <button
              onClick={printQrCode}
              className="background t-primary absolute inset-0 z-50 flex flex-col items-center justify-center gap-2 bg-opacity-0 opacity-0 group-hover:bg-opacity-70 group-hover:opacity-100 dark:bg-opacity-0 group-hover:dark:bg-opacity-70"
            >
              <FileDown size={30} />
              <h2 className="text-lg font-medium">{t("download-pdf")}</h2>
            </button>
          )}
          <div className="border-standard pointer-events-none relative aspect-square size-full overflow-hidden rounded-md border">
            <QrCodeComponent
              url={checkInUrl}
              loading={loading || isFetchingToken || !checkInUrl}
            />
            <div className="absolute inset-0 bg-transparent opacity-50 dark:bg-gradient-to-tr dark:from-foreground dark:to-transparent" />
            <div className="background t-primary sr-only pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2">
              <h2>{appointment.title}</h2>
              <p className="text-lg font-medium">
                {t("attendence_checkin.scan-to")}
              </p>
              <p>
                {replaceVariablesInString(
                  t("attendence_checkin.scan-valid-on"),
                  [dayjs(appointment.dateTime).format("MMMM DD, YYYY")],
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="relative flex flex-col gap-2">
          {isListening && !isFetchingToken && !!token && (
            <CountdownIndicator countDown={expiryMs} />
          )}
          <h1 className="t-primary text-2xl font-bold">Check In</h1>
          <p className="t-secondary text-sm">
            {t("attendence_checkin.scan-to-desc")}
          </p>
        </div>
        <div className="border-standard t-primary flex items-start justify-between rounded-md border px-2 py-1">
          <span className="flex-1">{appointment.title}</span>
          <div className="t-secondary flex items-center gap-2">
            <span>
              {dayjs(appointment.dateTime).format("HH:mm")} -{" "}
              {dayjs(appointment.dateTime)
                .add(appointment.duration, "minute")
                .format("HH:mm")}
            </span>
          </div>
        </div>
        <ExpirySelector />
      </div>
    </Modal>
  );
}
