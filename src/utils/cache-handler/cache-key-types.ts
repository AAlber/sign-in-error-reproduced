import type { ScheduleAppointment } from "@/src/types/appointment.types";
import type { ContentBlock } from "@/src/types/course.types";
import type { CourseWithDurationAndProgress } from "@/src/types/user.types";
import type { UserData } from "@/src/types/user-data.types";

export type CacheKeyTypeMapping = {
  "user-data": UserData;
  "course-upcoming-appointments": { appointments: ScheduleAppointment[] };
  "course-content-blocks": { contentBlocks: ContentBlock[] };
  "appointment-checkin-rotating-token": string; // token to appointmentId mapping
  "user-courses-with-progress-data": {
    courses: CourseWithDurationAndProgress[];
  };
};

interface RouteAccessRule {
  layerId: string;
  rolesWithAccess: Role[];
}

export type CachedRoute =
  | {
      prefix: keyof CacheKeyTypeMapping;
      requiredKey: "userId";
      path: string;
    }
  | {
      prefix: keyof CacheKeyTypeMapping;
      requiredKey: "layerId";
      path: string;
      accessRule: (layerId: string) => RouteAccessRule | null;
    };

export const cachedRoutes: CachedRoute[] = [
  {
    prefix: "user-data",
    requiredKey: "userId",
    path: "/api/kv-cached/user-data",
  },
  {
    prefix: "user-courses-with-progress-data",
    requiredKey: "userId",
    path: "/api/kv-cached/get-user-courses-with-progress-data",
  },
  {
    prefix: "course-upcoming-appointments",
    requiredKey: "layerId",
    path: "/api/kv-cached/get-course-upcoming-appointments",
    accessRule: (layerId: string) => {
      return {
        layerId: layerId,
        rolesWithAccess: ["admin", "educator", "member", "moderator"],
      };
    },
  },
  {
    prefix: "course-content-blocks",
    requiredKey: "layerId",
    path: "/api/kv-cached/get-course-content-blocks",
    accessRule: (layerId: string) => {
      return {
        layerId: layerId,
        rolesWithAccess: ["admin", "educator", "member", "moderator"],
      };
    },
  },
];
