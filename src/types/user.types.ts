import type { CourseIconType, Prisma } from "@prisma/client";
import type { SimpleCourseWithDuration } from "./course.types";

export type LayerUserHasAccessTo = {
  id: string;
  name: string;
  displayName: string | null;
  role: Role;
  course: {
    icon: string;
    iconType: CourseIconType;
  } | null;
};

export type CourseWithDurationAndProgress = {
  userProgress?: MemberCourseStatus;
} & SimpleCourseWithDuration;

export type MemberCourseStatus = {
  status: "FAILED" | "PASSED" | "IN_PROGRESS" | "ON_TRACK" | "RISK_OF_FAILURE";
  finishedContentBlocks: number;
};

export type CourseLayerUserHasAccessTo = Prisma.RoleGetPayload<{
  select: {
    layerId: true;
    role: true;
    layer: {
      start: true;
      end: true;
      select: {
        course: {
          select: {
            id: true;
            name: true;
            description: true;
            icon: true;
            iconType: true;
            layer_id: true;
            bannerImage: true;
            color: true;
          };
        };
      };
    };
  };
}>;

export type GetUserGradesProps = {
  userId: string;
  layerId?: string;
  institutionId?: string;
};

export type UserGrade = {
  name: string;
  layerName: string;
  grade: string;
};
