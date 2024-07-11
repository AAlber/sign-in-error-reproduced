import { Calendar, MapPin, User } from "lucide-react";
import { hasValidZoomMeetingLength } from "@/src/client-functions/client-video-chat-providers/zoom";
import AccessGate from "../../reusable/access-gate";
import MultiPageModal from "../../reusable/multi-page-modal";
import Spinner from "../../spinner";
import AppointmentNameAndDateTime from "./appointment-datetime-input";
import AppointmentLocationSettings from "./appointment-location-settings";
import { AppointmentUsers } from "./appointment-users";
import AppointmentDeleteButton from "./delete-btn";
import {
  durationIsNumberAndPositive,
  finishAppointmentCreationOrUpdate,
  isTitleNonEmpty,
} from "./functions";
import useAppointmentEditor from "./zustand";

export default function AppointmentEditor() {
  const {
    isSettingsMode,
    open,
    title,
    layerIds,
    userAttendeeIds,
    userGroupAttendeeIds,
    duration,
    setOpen,
    reset,
  } = useAppointmentEditor();

  return (
    <MultiPageModal
      open={open}
      setOpen={setOpen}
      title={
        isSettingsMode
          ? "appointment_modal.title_edit"
          : "appointment_modal.title"
      }
      finishButtonText={
        isSettingsMode ? "general.save" : "appointment_modal.button_finish"
      }
      onFinish={finishAppointmentCreationOrUpdate}
      additionalButton={isSettingsMode ? <DeleteButton /> : <></>}
      onClose={reset}
      useTabsInsteadOfSteps={isSettingsMode}
      height="lg"
      finishButtonDisabled={
        !isTitleNonEmpty(title) ||
        layerIds.length === 0 ||
        userAttendeeIds.length === 0
      }
      pages={[
        {
          nextStepRequirement: () =>
            isTitleNonEmpty(title) && durationIsNumberAndPositive(duration),
          title: "appointment_modal.step1_title",
          tabIcon: <Calendar size={17} />,
          tabTitle: "appointment_modal.step1_tab_title",
          description: "appointment_modal.step1_description",
          children: <AppointmentNameAndDateTime />,
        },
        {
          nextStepRequirement: () => hasValidZoomMeetingLength(duration),
          title: "appointment_modal.step2_title",
          tabTitle: "appointment_modal.step2_tab_title",
          tabIcon: <MapPin size={17} />,
          description: "appointment_modal.step2_description",
          children: <AppointmentLocationSettings />,
        },
        {
          nextStepRequirement: () =>
            (layerIds.length > 0 ||
              userAttendeeIds.length > 0 ||
              userGroupAttendeeIds.length > 0) &&
            isTitleNonEmpty(title),
          title: "appointment_modal.step3_title",
          tabTitle: "appointment_modal.step3_tab_title",
          tabIcon: <User size={17} />,
          description: "appointment_modal.step3_description",
          children: <AppointmentUsers />,
        },
      ]}
    />
  );
}

const DeleteButton = () => {
  const { layerIds } = useAppointmentEditor();
  const appointmentHasCourseAttendees = layerIds.length > 0;

  if (appointmentHasCourseAttendees) {
    return (
      <AccessGate
        layerIds={layerIds}
        rolesWithAccess={["admin", "moderator", "educator"]}
        loaderElement={<Spinner size="w-5 h-5" className="m-2" />}
      >
        <AppointmentDeleteButton />
      </AccessGate>
    );
  }

  return (
    <AccessGate
      checkWholeInstitutionForAccess
      rolesWithAccess={["admin", "moderator", "educator"]}
      loaderElement={<Spinner size="w-5 h-5" className="m-2" />}
    >
      <AppointmentDeleteButton />
    </AccessGate>
  );
};
