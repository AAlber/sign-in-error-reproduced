import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { updateAppointmentURL } from "@/src/client-functions/client-appointment";
import { checkInOnlineAttendence } from "@/src/client-functions/client-appointment-attendence";
import confirmAction from "@/src/client-functions/client-options-modal";
import classNames, {
  copyToClipBoard,
} from "@/src/client-functions/client-utils";
import { generateMeetingLink } from "@/src/client-functions/client-video-chat-providers";
import type { ScheduleAppointment } from "@/src/types/appointment.types";
import type { VideoChatProviderId } from "@/src/types/video-chat-provider-integration.types";
import AccessGate from "../../reusable/access-gate";
import { Button } from "../../reusable/shadcn-ui/button";

export default function AppointmentProviderDisplay({
  appointment,
}: {
  appointment: ScheduleAppointment;
}) {
  const [copyWasClicked, setCopyWasClicked] = useState(false);
  const [starting, setStarting] = useState(false);
  const { t } = useTranslation("page");
  const startEvent = async () => {
    setStarting(true);
    const generatedLink = await generateMeetingLink(
      appointment.provider as VideoChatProviderId,
      appointment.appointmentLayers.map((layer) => layer.layerId),
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

  return (
    <div className="flex flex-col gap-2 text-sm font-medium text-contrast">
      <div
        className={classNames(
          "flex cursor-pointer items-center justify-between text-muted-contrast",
        )}
        onClick={() => {
          if (!address) return;
          setCopyWasClicked(true);
          copyToClipBoard(address);
          checkInOnlineAttendence(appointment.id);
        }}
      >
        <>
          {address.length > 0 && (
            <div className="flex items-center gap-2">
              {!copyWasClicked ? (
                <Copy className="h-4 w-4 " />
              ) : (
                <Check className="h-4 w-4" />
              )}
              <p className="break-all text-xs text-primary">
                {address.length > 20 ? address.slice(0, 20) + "..." : address}
              </p>{" "}
            </div>
          )}
        </>

        <AccessGate
          rolesWithAccess={["admin", "moderator", "educator"]}
          layerIds={appointment.appointmentLayers.map((layer) => layer.layerId)}
        >
          <Button
            variant={"cta"}
            className="ml-auto"
            onClick={() =>
              confirmAction(startEvent, {
                title: "start_event_confirmation.title",
                description: "start_event_confirmation.description",
                actionName: "general.start",
              })
            }
          >
            {starting ? t("general.starting") + "..." : t("general.start")}
          </Button>
        </AccessGate>
        <AccessGate
          rolesWithAccess={["member"]}
          layerIds={appointment.appointmentLayers.map((layer) => layer.id)}
        >
          <Button
            variant={"positive"}
            enabled={!!address}
            onClick={(event) => {
              event.stopPropagation();
              checkInOnlineAttendence(appointment.id);
              window.open(address, "_blank");
            }}
          >
            {t("join")}
          </Button>
        </AccessGate>
      </div>
    </div>
  );
}
