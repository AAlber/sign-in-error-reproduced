import type {
  ContentBlock as PrismaContentBlock,
  Course,
  Layer,
  UserStatus,
} from "@prisma/client";
import type { ScheduleAppointment } from "./appointment.types";
import type { ContentBlockSpecsMapping } from "./content-block/types/specs.types";
import type { CourseLayerUserHasAccessTo } from "./user.types";

export type CourseDataWithLayerData = Course & { layer: Layer };

export type InitialCourseData = {
  contentBlocks: ContentBlock[];
  appointments: ScheduleAppointment[];
  hasSpecialRole: boolean;
};

export type SimpleCourse = NonNullable<
  CourseLayerUserHasAccessTo["layer"]["course"]
>;

export type SimpleCourseWithDuration = SimpleCourseWithUserRole &
  Pick<Layer, "start" | "end">;

export type SimpleCourseWithUserRole = SimpleCourse & {
  totalContentBlockCount?: number;
  publishedContentBlockCount?: number;
  appointmentCount?: number;
  role: Role;
};

export type ContentBlock<T extends keyof ContentBlockSpecsMapping = any> = Omit<
  PrismaContentBlock,
  "specs"
> & {
  requirements: ContentBlock<T>[];
  type: IfAny<T, keyof ContentBlockSpecsMapping, T>;
  userStatus: UserStatus | "LOCKED";
  specs: ContentBlockSpecsMapping[T];
  feedback?: {
    rating: number;
    count: number;
  };
};
