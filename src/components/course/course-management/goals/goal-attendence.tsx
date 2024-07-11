import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import courseGoalHandler from "@/src/client-functions/client-course-goals";
import useUser from "@/src/zustand/user";
import SettingsSection from "../../../reusable/settings/settings-section";
import { Input } from "../../../reusable/shadcn-ui/input";
import { Label } from "../../../reusable/shadcn-ui/label";
import useCourseManagement from "../zustand";

type Props = {
  layerId: string;
};

export default function GoalAttendence({ layerId }: Props) {
  const { attendence, setAttendence, points, setPoints } =
    useCourseManagement();
  const [attendanceValue, setAttendanceValue] = useState(attendence);
  const [pointsValue, setPointsValue] = useState(points);
  const { t } = useTranslation("page");
  const { user } = useUser();

  useEffect(() => {
    setAttendanceValue(attendence);
    setPointsValue(points);
  }, [attendence, points]);

  const updateAttendance = (value) => {
    if (value > 100) {
      setAttendanceValue(100);
    } else {
      setAttendanceValue(parseInt(value));
    }
  };

  const updatePoints = (value) => {
    if (value > 100) {
      setPointsValue(100);
    } else {
      setPointsValue(parseInt(value));
    }
  };

  return (
    <SettingsSection
      title="course_settings.general"
      subtitle="course_settings.general_description"
      footerButtonText="general.save"
      footerButtonDisabled={
        isNaN(attendanceValue) ||
        isNaN(pointsValue) ||
        (attendanceValue === attendence && pointsValue === points)
      }
      footerButtonAction={async () => {
        courseGoalHandler.update.goal({
          layerId,
          attendanceGoal: attendanceValue,
          points: pointsValue,
        });
        setAttendence(attendanceValue);
        setPoints(pointsValue);
      }}
    >
      <ul className="mb-4 flex grid-cols-2 flex-col gap-4 xl:grid">
        <li>
          <Label>{t("course_management.goals.attendence")}</Label>
          <Input
            type="number"
            className="mt-2"
            value={attendanceValue}
            onChange={(e) => updateAttendance(e.target.value)}
          />
          <p className="mt-2 text-xs text-muted-contrast">
            {t("course_management.goals.attendence_description")}
          </p>
        </li>
        {user.institution?.institutionSettings.addon_ects_points && (
          <li>
            <Label>{t("course_management.goals.points")}</Label>
            <Input
              type="number"
              className="mt-2"
              value={pointsValue}
              onChange={(e) => updatePoints(e.target.value)}
            />
          </li>
        )}
      </ul>
    </SettingsSection>
  );
}
