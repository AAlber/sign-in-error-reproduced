import { t } from "i18next";
import { CheckCircle, Pencil, Trash2, UserCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import useAppointmentAttendenceModal from "@/src/components/popups/appointment-attendence/zustand";
import useAppointmentCheckInModal from "@/src/components/popups/appointment-check-in/zustand";
import useAppointmentEditor from "@/src/components/popups/appointment-editor/zustand";
import AccessGate from "@/src/components/reusable/access-gate";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import Spinner from "@/src/components/spinner";
import type { ScheduleAppointment } from "@/src/types/appointment.types";
import useUser from "@/src/zustand/user";
import { AppointmentAdminOptionsDropdownDelete } from "./delete-btn";

export const AppointmentOptions = ({
  appointment,
}: {
  appointment: ScheduleAppointment;
}) => {
  const { t } = useTranslation("page");
  const { user } = useUser();
  const { init: initAttendence } = useAppointmentAttendenceModal();
  const { init: initCheckin } = useAppointmentCheckInModal();

  const appointmentOnlyHasUsersOrUserGroupsAttendees =
    (appointment.appointmentUsers.length > 0 ||
      appointment.appointmentUserGroups.length > 0) &&
    appointment.appointmentLayers.length === 0;
  const isCreator = appointment.appointmentCreator?.userId === user.id;
  const isOrganizer = (appointment.organizerUsers ?? []).some(
    (u) => u.organizerId === user.id,
  );
  const isCreatorOrOrganizer = isCreator || isOrganizer;

  return (
    <>
      <EditButton appointment={appointment} />
      {isCreatorOrOrganizer && (
        <>
          <DropdownMenuItem
            key="attendance"
            onClick={() => initAttendence(appointment)}
          >
            <UserCheck className="size-4" />
            {t("attendance")}
          </DropdownMenuItem>

          {!appointment.isOnline && (
            <DropdownMenuItem
              key="checkin"
              onClick={() => initCheckin(appointment)}
            >
              <CheckCircle className="size-4" />
              {t("attendence.qr_checkin")}
            </DropdownMenuItem>
          )}
        </>
      )}

      {!isCreatorOrOrganizer && (
        <AccessGate
          layerIds={[...(appointment.appointmentLayers ?? [])].map(
            (l) => l.layerId,
          )}
          rolesWithAccess={["admin", "moderator", "educator"]}
          loaderElement={<Spinner size="w-5 h-5" className="m-2" />}
        >
          <>
            <DropdownMenuItem
              key="attendance"
              onClick={() => initAttendence(appointment)}
            >
              <UserCheck className="size-4" />
              {t("attendance")}
            </DropdownMenuItem>

            {!appointment.isOnline && (
              <DropdownMenuItem
                key="checkin"
                onClick={() => initCheckin(appointment)}
              >
                <CheckCircle className="size-4" />
                {t("attendence.qr_checkin")}
              </DropdownMenuItem>
            )}
          </>
        </AccessGate>
      )}

      {isCreator ? (
        <DeleteButton appointment={appointment} />
      ) : (
        <>
          {appointmentOnlyHasUsersOrUserGroupsAttendees && isOrganizer && (
            <AccessGate
              checkWholeInstitutionForAccess
              rolesWithAccess={["admin", "moderator", "educator"]}
              loaderElement={<Spinner size="w-5 h-5" className="m-2" />}
            >
              <DeleteButton appointment={appointment} />
            </AccessGate>
          )}
          {!appointmentOnlyHasUsersOrUserGroupsAttendees && (
            <AccessGate
              layerIds={[...appointment.appointmentLayers].map(
                (l) => l.layerId,
              )}
              rolesWithAccess={["admin", "moderator", "educator"]}
              loaderElement={<Spinner size="w-5 h-5" className="m-2" />}
            >
              <DeleteButton appointment={appointment} />
            </AccessGate>
          )}
        </>
      )}
    </>
  );
};

const EditButton = ({ appointment }: { appointment: ScheduleAppointment }) => {
  const { initSettings } = useAppointmentEditor();
  return (
    <>
      {!appointment.series ? (
        <DropdownMenuItem
          key="edit"
          onClick={() => initSettings(appointment.id, false, appointment)}
        >
          <Pencil className="size-4" />
          {t("general.edit")}
        </DropdownMenuItem>
      ) : (
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Pencil className="size-4" />
            {t("general.edit")}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem
              key="occurrence"
              onClick={() => initSettings(appointment.id, false, appointment)}
            >
              {t("edit.occurrence")}
            </DropdownMenuItem>
            <DropdownMenuItem
              key="series"
              onClick={() => initSettings(appointment.id, true, appointment)}
            >
              {t("edit.series")}
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      )}
    </>
  );
};

const DeleteButton = ({
  appointment,
}: {
  appointment: ScheduleAppointment;
}) => {
  return (
    <>
      <DropdownMenuSeparator />
      {!appointment.series ? (
        <AppointmentAdminOptionsDropdownDelete appointmentId={appointment.id} />
      ) : (
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Trash2 className="size-4" />
            {t("general.delete")}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <AppointmentAdminOptionsDropdownDelete
              appointmentId={appointment.id}
            />
            <AppointmentAdminOptionsDropdownDelete
              appointmentId={appointment.id}
              editSeries
            />
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      )}
    </>
  );
};
