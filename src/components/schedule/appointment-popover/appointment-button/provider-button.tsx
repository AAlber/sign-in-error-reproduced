import { useState } from "react";
import { useTranslation } from "react-i18next";
import { updateAppointmentURL } from "@/src/client-functions/client-appointment";
import { checkInOnlineAttendence } from "@/src/client-functions/client-appointment-attendence";
import confirmAction from "@/src/client-functions/client-options-modal";
import { copyToClipBoard } from "@/src/client-functions/client-utils";
import { generateMeetingLink } from "@/src/client-functions/client-video-chat-providers";
import AccessGate from "@/src/components/reusable/access-gate";
import type { ScheduleAppointment } from "@/src/types/appointment.types";
import type { VideoChatProviderId } from "@/src/types/video-chat-provider-integration.types";
import { AppointmentButton } from "./reusable-button";

export const ProviderButton = ({
  appointment,
}: {
  appointment: ScheduleAppointment;
}) => {
  const { t } = useTranslation("page");
  const [starting, setStarting] = useState(false);

  const startEvent = async () => {
    setStarting(true);
    const generatedLink = await generateMeetingLink(
      appointment.provider as VideoChatProviderId,
      (appointment.appointmentLayers ?? []).map((layer) => layer.layerId),
      appointment.title,
      appointment.duration,
    );

    if (!generatedLink || !generatedLink.modUrl || !generatedLink.url) {
      // No need to invoke toast here,
      // as toast invocation is already handled
      // inside the methods within generateMeetingLink.
      return;
    }

    await updateAppointmentURL(appointment.id, generatedLink.url);
    window.open(generatedLink.modUrl);
    setStarting(false);
  };
  const address = appointment.onlineAddress;

  const copyClick = () => {
    if (!address) return;
    copyToClipBoard(address);
    checkInOnlineAttendence(appointment.id);
  };

  return (
    <>
      <AccessGate
        rolesWithAccess={["admin", "moderator", "educator"]}
        layerIds={(appointment.appointmentLayers ?? []).map(
          (layer) => layer.layerId,
        )}
      >
        <AppointmentButton
          buttonText={
            starting ? t("general.starting") + "..." : t("general.start")
          }
          onClick={() =>
            confirmAction(startEvent, {
              title: "start_event_confirmation.title",
              description: "start_event_confirmation.description",
              actionName: "general.start",
            })
          }
          showCopyButton
          onCopyClick={copyClick}
        />
      </AccessGate>
      <AccessGate
        rolesWithAccess={["member"]}
        layerIds={(appointment.appointmentLayers ?? []).map(
          (layer) => layer.layerId,
        )}
      >
        <AppointmentButton
          buttonText={t("join")}
          onClick={() => {
            checkInOnlineAttendence(appointment.id);
            window.open(address, "_blank");
          }}
          showCopyButton
          onCopyClick={copyClick}
          disableButton={!address}
          disableTooltip
        />
      </AccessGate>
    </>
  );
};
