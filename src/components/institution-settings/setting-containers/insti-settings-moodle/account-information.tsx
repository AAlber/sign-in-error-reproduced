import { Button } from "fuxam-ui";
import { BookOpen } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { MoodleActionsValidator } from "@/src/client-functions/client-moodle-integration/moodle-actions-validator";
import Form from "@/src/components/reusable/formlayout";
import SettingsSection from "@/src/components/reusable/settings/settings-section";
import type { MoodleWebServiceFunctions } from "@/src/server/functions/server-moodle/types";

type Props = {
  sitename: string;
  username: string;
  functions: { name: string }[];
};

export default function MoodleAccountInformation({
  sitename,
  username,
  functions,
}: Props) {
  const { t } = useTranslation("page");

  const actionsValidator = new MoodleActionsValidator(
    functions.map(({ name }) => name),
  );

  return (
    <SettingsSection
      title="moodle.settings.title.account_information.title"
      subtitle="moodle.settings.title.account_information.subtitle"
      loading={false}
      noFooter
    >
      <div className="mb-4 flex justify-end">
        <Button
          onClick={() => {
            window.open(
              "https://gratis-art-2b9.notion.site/Moodle-Integration-Documentation-071bab7dc06a475c98aebebfed5bba5b",
              "_blank",
            );
          }}
        >
          {<BookOpen className="mr-1 h-4 w-4" />}
          {t("documentation")}
        </Button>
      </div>

      <Form>
        <Form.Item label="moodle.settings.title.account_information.form.site_name">
          {sitename}
        </Form.Item>
        <Form.Item label="username">{username}</Form.Item>
      </Form>

      {!actionsValidator.hasSufficientPermissions && (
        <>
          <div className="mt-12 w-full space-y-4">
            {(!actionsValidator.canReadCourses ||
              !actionsValidator.canReadUsers ||
              !actionsValidator.canReadAppointments) && (
              <p className="text-sm">
                {t("moodle.insuficient_permissions.moodle_to_fuxam")}
              </p>
            )}

            {!actionsValidator.canReadCourses && (
              <Form.Item label="moodle.insuficient_permissions.read_course">
                <Code>
                  {(
                    [
                      "core_course_get_categories",
                      "core_course_get_courses",
                    ] as MoodleWebServiceFunctions[]
                  ).join(", ")}
                </Code>
              </Form.Item>
            )}

            {!actionsValidator.canReadUsers && (
              <Form.Item label="moodle.insuficient_permissions.read_users">
                <Code>
                  {(
                    [
                      "core_user_get_users",
                      "core_enrol_get_enrolled_users",
                    ] as MoodleWebServiceFunctions[]
                  ).join(", ")}
                </Code>
              </Form.Item>
            )}

            {!actionsValidator.canReadAppointments && (
              <Form.Item label="moodle.insuficient_permissions.read_appointments">
                <Code>
                  {(
                    [
                      "core_calendar_get_calendar_events",
                      "core_course_get_courses",
                    ] as MoodleWebServiceFunctions[]
                  ).join(", ")}
                </Code>
              </Form.Item>
            )}
          </div>
          <div className="mt-12 w-full space-y-4">
            {(!actionsValidator.canWriteCourses ||
              !actionsValidator.canWriteUsers ||
              !actionsValidator.canWriteAppointments ||
              !actionsValidator.canEnrollUsers) && (
              <p className="text-sm">
                {t("moodle.insuficient_permissions.fuxam_to_moodle")}
              </p>
            )}
            {!actionsValidator.canWriteCourses && (
              <Form.Item label="moodle.insuficient_permissions.write_courses">
                <Code>
                  {(
                    [
                      "core_course_create_courses",
                      "core_course_update_categories",
                      "core_course_create_categories",
                    ] as MoodleWebServiceFunctions[]
                  ).join(", ")}
                </Code>
              </Form.Item>
            )}

            {!actionsValidator.canEnrollUsers && (
              <Form.Item label="moodle.insuficient_permissions.enroll_users">
                <Code>
                  {(
                    [
                      "core_enrol_get_enrolled_users",
                      "enrol_manual_enrol_users",
                    ] as MoodleWebServiceFunctions[]
                  ).join(", ")}
                </Code>
              </Form.Item>
            )}

            {!actionsValidator.canWriteUsers && (
              <Form.Item label="moodle.insuficient_permissions.write_users">
                <Code>
                  {(
                    ["core_user_create_users"] as MoodleWebServiceFunctions[]
                  ).join(", ")}
                </Code>
              </Form.Item>
            )}

            {!actionsValidator.canWriteAppointments && (
              <Form.Item label="moodle.insuficient_permissions.write_appointments">
                <Code>
                  {(
                    [
                      "core_calendar_create_calendar_events",
                      "core_course_get_courses",
                      "core_calendar_get_calendar_events",
                    ] as MoodleWebServiceFunctions[]
                  ).join(", ")}
                </Code>
              </Form.Item>
            )}
          </div>
        </>
      )}
    </SettingsSection>
  );
}

function Code({ children }) {
  return (
    <pre className="w-full whitespace-pre-line break-words rounded-md border border-border bg-background px-2 py-1 text-xs leading-6">
      {children}
    </pre>
  );
}
