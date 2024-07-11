type CourseMember = SimpleUser & {
  overwrittenStatus:
    | {
        id: string;
        userId: string;
        passed: boolean;
        notes: string | null;
      }
    | undefined;
  layerId: string;
  attendanceStatus: AttendenceStatus;
  prerequisitesStatus: PrerequisitesStatus[];
};

type AttendenceStatus = {
  percentage: number;
  attendedAppointmentsCount: number;
  appointmentsInFutureCount: number;
  totalAppointmentsCount: number;
  isRateSufficient: boolean;
};

type PrerequisitesStatus = {
  contentBlock: { id: string; name: string };
  status: "not-started" | "not-rated" | "passed" | "failed";
  rating: { id: string; label: string } | null;
};

type OverwriteCourseUserStatus = {
  userId: string;
  layerId: string;
  passed: boolean;
  notes: string | null;
};

type RemoveOverwriteCourseUserStatus = {
  id: string;
};
