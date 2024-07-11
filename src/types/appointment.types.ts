import type { Prisma } from "@prisma/client";
import type { UserCSVData } from "../components/reusable/csv-export-button/export-user-data";
import type { VideoChatProviderId } from "./video-chat-provider-integration.types";

export type AppointmentInitSource = "settings" | "schedule" | "default";

export type AppointmentEventType = "hybrid" | "in-person" | "online";

export type AppointmentData = {
  title: string;
  dateTime: string;
  duration: number;
  isOnline: boolean;
  isHybrid: boolean;
  address: string;
  onlineAddress: string;
  provider: "custom" | "fuxam" | VideoChatProviderId;
  layerIds: string[];
  userAttendeeIds: string[];
  userGroupAttendeeIds: string[];
  roomId?: string;
  organizerIds: string[];
  seriesId?: string;
  notes: string;
};

export type UpdateAppointmentData = {
  id: string;
  title: string;
  dateTime: string;
  duration: number;
  isOnline: boolean;
  isHybrid: boolean;
  address: string;
  onlineAddress: string;
  provider: "custom" | "fuxam" | VideoChatProviderId;
  layerIds: string[];
  userAttendeeIds: string[];
  userGroupAttendeeIds: string[];
  roomId: string;
  organizerIds: string[];
  updateSeries: boolean;
  seriesId?: string;
  rRule?: string;
  notes: string;
};

export type OrganizerData = {
  name: string;
  selectedDataForDisplay: string;
};

export type ScheduleAppointment = Prisma.AppointmentGetPayload<{
  include: {
    appointmentLayers: { include: { layer: true; course: true } };
    appointmentUsers: { include: { user: true } };
    appointmentCreator: true;
    appointmentUserGroups: { include: { userGroup: true } };
    organizerUsers: { select: { organizerId: true } };
    room: true;
    series: true;
    // organizer: true;
  };
}> & {
  hasAttended?: boolean;
  organizerData?: OrganizerData[];
  type?: "draft" | "appointment";
};

export type PaginatedAppointments = {
  appointments: ScheduleAppointment[];
  pagination: Pagination;
};

export type UpdateAppointmentSeriesData = UpdateAppointmentData & {
  seriesId: string;
  rRule?: string;
};

export type AppointmentDataTypeWithSeriesData = AppointmentData & {
  isSeries: boolean;
  rRule?: string;
};

export type AttendanceCheckInResponse = {
  success: boolean;
  error?: CheckInError;
};

type CheckInError =
  | "checkin-invalid-date"
  | "checkin-expired"
  | "checkin-invalid-key"
  | "checkin-unknown-error"
  | "checkin-too-early"
  | "checkin-unauthorized";

export type CustomScheduleFilter = {
  id: string;
  userId: string;
  layerIds: string[];
  name: string;
  checked: boolean;
};

export type InstitutionRoomWithAppointments = Prisma.InstitutionRoomGetPayload<{
  include: {
    appointments: true;
  };
}>;

export type UserAttendenceDataToExportProps = {
  timestamp: string;
  attendance: string;
};

export type UserInfos = UserCSVData<UserAttendenceDataToExportProps>;

export type RawAppointmentReturnType<
  Path extends string,
  FilterPath extends string,
> = Prisma.RoleGetPayload<{
  select: {
    [key in Path]: {
      select: {
        [key in FilterPath]: {
          select: {
            appointment: {
              include: {
                appointmentLayers: {
                  include: {
                    layer: true;
                    course: true;
                  };
                };
                room: true;
                organizerUsers: {
                  select: {
                    organizerId: true;
                  };
                };
                series: true;
                appointmentUsers: {
                  include: {
                    user: true;
                  };
                };
                appointmentCreator: {
                  include: {
                    user: true;
                  };
                };
                appointmentUserGroups: {
                  include: {
                    userGroup: true;
                  };
                };
              };
            };
          };
        };
      };
    };
  };
}>;

export type AppointmentAttendee = {
  id: string;
  name: string;
  image: string | null;
  email?: string;
  conflicts?: any; // Only for USER,
  course?: any; // Only for LAYER
  isCourse?: boolean; // Only for LAYER
  type: "layer" | "user" | "group";
} & (
  | { type: "layer"; course: any; isCourse: boolean }
  | { type: "user"; image: string; conflicts: any }
  | { type: "group"; image: string }
);
