import qs from "qs";
import { HttpError } from "@/src/utils/exceptions/http-error";
import type {
  MoodleAccountInformation,
  MoodleApiCategoryResponse,
  MoodleApiCoursesResponse,
  MoodleApiCreateCategoryResponse,
  MoodleApiGetCalendarEventsResponse,
  MoodleApiGetCourseUsersByCourseIdResponse,
  MoodleApiUsersResponse,
  MoodleCategoryPayload,
  MoodleCoursesPayload,
  MoodleEnrollUsersPayload,
  MoodleEventsPayload,
  MoodleGetCategoryPayload,
  MoodleUpdateCategoryPayload,
  MoodleUsersPayload,
  MoodleWebServiceFunctions,
} from "./types";

export const MOODLE_FUXAM_CATEGORY_ID_NUMBER = "fuxam";
export const MOODLE_STUDENT_ROLE_ID = 5;

export class MoodleWebServiceClient {
  apiEndpoint = "webservice/rest/server.php";

  constructor(
    private readonly apiKey: string,
    private readonly host: string,
  ) {}

  async healthCheck() {
    const url = new URL(this.apiEndpoint, this.host);

    const data = await fetch(url);
    if (!data.ok) return false;
    return true;
  }

  getSiteInfo() {
    return this._query<MoodleAccountInformation>(
      "core_webservice_get_site_info",
    );
  }

  getUsers() {
    return this._query<MoodleApiUsersResponse>("core_user_get_users", {
      criteria: [{ key: "email", value: "%" }], // will return all users
    });
  }

  getCourses() {
    return this._query<MoodleApiCoursesResponse[]>("core_course_get_courses");
  }

  createUsers(users: MoodleUsersPayload[]) {
    return this._query("core_user_create_users", {
      users,
    });
  }

  createCategory(categories: MoodleCategoryPayload[]) {
    return this._query<MoodleApiCreateCategoryResponse>(
      "core_course_create_categories",
      {
        categories,
      },
    );
  }

  getCategories(query?: MoodleGetCategoryPayload[]) {
    return this._query<MoodleApiCategoryResponse[]>(
      "core_course_get_categories",
      query ? { criteria: query } : undefined,
    );
  }

  createEvents(events: MoodleEventsPayload[]) {
    return this._query("core_calendar_create_calendar_events", { events });
  }

  getCalendarEvents(courseids: number[]) {
    return this._query<MoodleApiGetCalendarEventsResponse>(
      "core_calendar_get_calendar_events",
      {
        events: { courseids },
      },
    );
  }

  updateCategories(categories: MoodleUpdateCategoryPayload[]) {
    return this._query("core_course_update_categories", {
      categories,
    });
  }

  enrollUsers(enrolments: MoodleEnrollUsersPayload[]) {
    return this._query<null>("enrol_manual_enrol_users", {
      enrolments,
    });
  }

  getCourseUsers(courseid: number) {
    return this._query<MoodleApiGetCourseUsersByCourseIdResponse[]>(
      "core_enrol_get_enrolled_users",
      {
        courseid,
      },
    );
  }

  async createCourses(courses: MoodleCoursesPayload[]) {
    return await this._query("core_course_create_courses", {
      courses,
    });
  }

  private async _query<T>(
    webServiceFunction: MoodleWebServiceFunctions,
    args?: any,
  ) {
    let url = new URL(this.apiEndpoint, this.host);
    url.searchParams.append("wstoken", this.apiKey);
    url.searchParams.append("wsfunction", webServiceFunction);
    url.searchParams.append("moodlewsrestformat", "json");

    if (args) {
      const query = qs.stringify(args);
      url = new URL(`${url}&${query}`);
    }

    const result = await fetch(url);
    if (!result.ok) throw new HttpError("Cannot connect to moodle site");

    const data = await result.json();
    if (!!data?.exception) throw new HttpError(data?.message ?? "Moodle Error");

    return data as T;
  }
}
