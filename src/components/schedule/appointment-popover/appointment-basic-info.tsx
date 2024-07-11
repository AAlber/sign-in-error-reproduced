import { ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import type {
  AppointmentAttendee,
  ScheduleAppointment,
} from "@/src/types/appointment.types";
import { useNavigation } from "../../dashboard/navigation/zustand";
import { AppointmentAttendeeWrapper } from "../../popups/appointment-editor/appointment-attendee-wrapper";
import { AutoLayerCourseIconDisplay } from "../../reusable/course-layer-icons";
import { Button } from "../../reusable/shadcn-ui/button";
import TruncateHover from "../../reusable/truncate-hover";
import { InfoText } from "./appointment-info-text";

export const AppointmentBasicInfo = ({
  appointment,
}: {
  appointment: ScheduleAppointment;
}) => {
  const { navigateToTab: navigatorToTab, setPage } = useNavigation();

  const { t } = useTranslation("page");

  const layerLength = appointment.appointmentLayers
    ? appointment.appointmentLayers.length
    : 0;
  const userLength = appointment.appointmentUsers
    ? appointment.appointmentUsers.length
    : 0;
  const userGroupLength = appointment.appointmentUserGroups
    ? appointment.appointmentUserGroups.length
    : 0;
  const totalAttendeesLength = layerLength + userLength + userGroupLength;

  const hasMoreThanFiveAttendees = totalAttendeesLength > 5;

  const appointmentType = () => {
    if (appointment.isHybrid) {
      return "appointment.popover.hybrid";
    }
    if (appointment.isOnline) {
      return "appointment.popover.online";
    } else {
      return "appointment.popover.in_person";
    }
  };

  const appointmentCourseLayerDescription = () => {
    const layerLength = appointment.appointmentLayers
      ? appointment.appointmentLayers.length
      : 0;
    const userLength = appointment.appointmentUsers
      ? appointment.appointmentUsers.length
      : 0;
    const userGroupLength = appointment.appointmentUserGroups
      ? appointment.appointmentUserGroups.length
      : 0;
    const totalAttendeesLength = layerLength + userLength + userGroupLength;

    if (totalAttendeesLength > 1) {
      return t("appointment.popover.attendees");
    }

    return t("appointment.popover.attendee");
  };

  const allAttendees = (): AppointmentAttendee[] => {
    const typedLayers = (appointment.appointmentLayers ?? []).map((layer) => ({
      type: "layer",
      id: layer.layerId,
      name: layer.layer.name,
      image: "",
      course: layer.course,
      isCourse: layer.layer.isCourse,
    })) as AppointmentAttendee[];

    const typedUsers = (appointment.appointmentUsers ?? []).map(({ user }) => {
      return {
        type: "user",
        id: user.id,
        name: user.name,
        image: user.image,
      };
    }) as AppointmentAttendee[];

    const typedUserGroups = (appointment.appointmentUserGroups ?? []).map(
      ({ userGroup }) => ({
        type: "group",
        id: userGroup.id,
        name: userGroup.name,
        image: "",
      }),
    ) as AppointmentAttendee[];

    if (hasMoreThanFiveAttendees) {
      return [...typedLayers, ...typedUsers, ...typedUserGroups].slice(0, 5);
    }

    return [...typedLayers, ...typedUsers, ...typedUserGroups];
  };

  return (
    <div className="mt-4 grid grid-cols-2 justify-between gap-4">
      <InfoText title={t("appointment.popover.type.text")}>
        {t(appointmentType())}
      </InfoText>
      {appointment.organizerData && appointment.organizerData.length > 0 ? (
        <InfoText title={t("organizer")}>
          {(appointment.organizerData ?? []).map((organizer, index) => (
            <TruncateHover
              key={index}
              text={organizer.name}
              truncateAt={20}
              className="text-contrast"
            />
          ))}
        </InfoText>
      ) : null}
      <InfoText title={t(appointmentCourseLayerDescription())}>
        <>
          {(allAttendees() ?? []).map((a) => (
            <div key={a.id} className="flex gap-1">
              {a.type === "layer" && a.course ? (
                <Button
                  onClick={() => {
                    setPage("COURSES");
                    navigatorToTab(a.id);
                  }}
                  variant={"link"}
                  className="flex h-5 w-full items-center justify-start gap-1 p-0 text-start font-normal"
                >
                  <AutoLayerCourseIconDisplay
                    course={a.course}
                    height={15}
                    width={15}
                  />
                  <TruncateHover
                    text={a.name || ""}
                    truncateAt={13}
                    className="text-contrast"
                  />
                  <ExternalLink className="h-3.5 w-5 text-muted" />
                </Button>
              ) : (
                <AppointmentAttendeeWrapper
                  size="sm"
                  appointmentAttendee={a}
                  renderType="tag"
                />
              )}
            </div>
          ))}
        </>
        {hasMoreThanFiveAttendees && (
          <p className="mt-1 text-sm text-muted-contrast">
            {t("and-x-more", { x: (totalAttendeesLength - 5).toString() })}
          </p>
        )}
      </InfoText>
      {!appointment.isOnline && !appointment.room && (
        <InfoText title={t("appointment.popover.address")}>
          {appointment.address}
        </InfoText>
      )}
      {!appointment.isOnline && appointment.room && (
        <InfoText title={t("appointment.popover.location")}>
          <div className="flex flex-col">
            {appointment.room.name}
            <span className="text-xs text-muted-contrast">
              {appointment.room.address}
            </span>
          </div>
        </InfoText>
      )}{" "}
      {!appointment.isOnline &&
        appointment.room &&
        appointment.room.addressNotes && (
          <InfoText title={t("appointment.popover.directions")}>
            <div className="flex flex-col text-xs">
              {appointment.room.addressNotes}
            </div>
          </InfoText>
        )}{" "}
    </div>
  );
};
