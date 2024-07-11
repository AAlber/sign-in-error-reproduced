import type { MoodleWebServiceFunctions } from "@/src/server/functions/server-moodle/types";

export class MoodleActionsValidator {
  constructor(private readonly currentCapabilities: string[]) {}

  get canReadUsers() {
    return this._validateAction(["core_user_get_users"]);
  }

  get canWriteUsers() {
    return this._validateAction(["core_user_create_users"]);
  }

  get canReadWriteUsers() {
    return this.canReadUsers && this.canWriteUsers;
  }

  get canReadCourses() {
    return this._validateAction([
      "core_course_get_categories",
      "core_course_get_courses",
    ]);
  }

  get canWriteCourses() {
    return this._validateAction([
      "core_course_update_categories",
      "core_course_create_categories",
      "core_course_create_courses",
    ]);
  }

  get canReadWriteCourses() {
    return this.canReadCourses && this.canWriteCourses;
  }

  get canReadAppointments() {
    return this._validateAction(["core_calendar_get_calendar_events"]);
  }

  get canWriteAppointments() {
    return this._validateAction(["core_calendar_create_calendar_events"]);
  }

  get canReadWriteAppointments() {
    return this.canReadAppointments && this.canWriteAppointments;
  }

  get canEnrollUsers() {
    return this._validateAction([
      "enrol_manual_enrol_users",
      "core_enrol_get_enrolled_users",
    ]);
  }

  get hasSufficientPermissions() {
    return (
      this.canReadWriteAppointments &&
      this.canReadWriteCourses &&
      this.canReadWriteUsers
    );
  }

  private _validateAction(capabilities: MoodleWebServiceFunctions[]) {
    return capabilities.every((action) =>
      this.currentCapabilities.includes(action),
    );
  }
}
