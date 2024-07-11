/**
 * Refer to generated API documentation from moodle site for payload and API responses
 * Moodle DateTime values is in SECONDS since Epoch
 */

import type {
  Appointment,
  AppointmentSeries,
  Course,
  Prisma,
} from "@prisma/client";

export type MoodleUsersPayload = {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
};

export type MoodleCoursesPayload = {
  fullname: string;
  shortname: string;
  idnumber: string;
  categoryid?: number;
  summary?: string;
  startdate?: number;
  enddate?: number;
};

export type MoodleCategoryPayload = {
  name: string;
  description: string;
  idnumber: string;
};

export type MoodleGetCategoryPayload = {
  key: keyof MoodleCategoryPayload;
  value: MoodleCategoryPayload[keyof MoodleCategoryPayload];
};

export type MoodleUpdateCategoryPayload = {
  id: number;
  name?: string;
  idnumber?: string;
  parent?: number;
  description?: string;
};

export type MoodleEnrollUsersPayload = {
  roleid: number;
  userid: number;
  courseid: number;
  timestart?: number;
  timeend?: number;
  suspend?: number;
};

/**
 * These are the minimum required API functions which the Moodle Site
 * users needs to enable to get this integration to work correctly
 *
 * https://docs.moodle.org/dev/Web_service_API_functions
 */
export const MoodleWebServiceFunctions = [
  "core_course_get_courses",
  "core_webservice_get_site_info",
  "core_user_get_users",
  "core_user_create_users",
  "core_course_create_courses",
  "core_course_create_categories",
  "core_course_get_categories",
  "core_course_update_categories",
  "enrol_manual_enrol_users",
  "core_enrol_get_enrolled_users",
  "core_calendar_create_calendar_events",
  "core_calendar_get_calendar_events",
] as const;

export type MoodleWebServiceFunctions =
  (typeof MoodleWebServiceFunctions)[number];

export type MoodleApiUsersResponse = {
  users: {
    email: string;
    id: number;
    fullname: string;
    username: string;
  }[];
};

export type MoodleApiCoursesResponse = {
  shortname: string;
  idnumber: string;
  fullname: string;
  id: number;
  summary: string;
  categoryid: number;
  displayname: string;
  startdate: number;
  enddate: number;
};

export type MoodleApiGetCourseUsersByCMIDResponse = {
  users: {
    id: number;
    fullname: string;
    firstname: string;
    lastname: string;
  }[];
};

export type MoodleApiGetCourseUsersByCourseIdResponse = {
  id: number;
  fullname: string;
  firstname: string;
  lastname: string;
  email: string;
};

export type MoodleApiCreateCategoryResponse = {
  id: number;
  name: string;
};

export type MoodleApiCategoryResponse = {
  id: number;
  name: string;
  idnumber: string;
  description: string;
  parent: number;
  coursecount: 2;
  depth: number;
};

export type MoodleEventsPayload = {
  name: string;
  description: string;
  courseid: number;
  repeats: number;
  eventtype: "course";
  timestart: string;
  timeduration: string;
  visible: number;
  sequence: number;
};

export type FuxamLayerType = Prisma.LayerGetPayload<{
  include: { course: { select: { name: true; description: true } } };
}>;

export type MoodleApiCreateEventsResponse = {
  events: {
    id: number; //event id
    name: string; //event name
    description: string; //Description
    format: number; //description format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN)
    courseid: number; //course id
    groupid: number; //group id
    userid: number; //user id
    repeatid: number; //repeat id
    modulename: string; //module name
    instance: number; //instance id
    eventtype: string; //Event type
    timestart: number; //timestart
    timeduration: number; //time duration
    visible: number; //visible
    uuid: string; //unique id of ical events
    sequence: number; //sequence
    timemodified: number; //time modified
    subscriptionid: number; //Subscription id
  }[];
};

export type MoodleApiGetCalendarEventsResponse = {
  events: {
    id: number; //event id
    name: string; //event name
    description: string; //Description
    format: number; //description format (1 = HTML, 0 = MOODLE, 2 = PLAIN, or 4 = MARKDOWN)
    courseid: number; //course id
    categoryid: number; //Category id (only for category events).
    groupid: number; //group id
    userid: number; //user id
    repeatid: number; //repeat id
    modulename: string; //module name
    instance: number; //instance id
    eventtype: string; //Event type
    timestart: number; //timestart
    timeduration: number; //time duration
    visible: number; //visible
    uuid: string; //unique id of ical events
    sequence: number; //sequence
    timemodified: number; //time modified
    subscriptionid: number; //Subscription id
  }[];
};

export type NormalizedFuxamAppointmentType = Omit<Appointment, "id"> & {
  course: Course | null;
  layerId: string;
  appointmentId: string;
  series: AppointmentSeries | null;
};

export type MoodleAccountInformation = {
  sitename: string;
  username: string;
  functions: { name: string }[];
  exception?: string; // if any invalid data moodle api will send the exception code and message
  message?: string;
};
