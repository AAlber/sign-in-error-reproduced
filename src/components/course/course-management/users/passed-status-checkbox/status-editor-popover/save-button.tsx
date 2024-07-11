import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  overwriteCourseUserStatus,
  removeOverwrittenCourseUserStatus,
} from "@/src/client-functions/client-course-overwritten-user-status";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import useCourseManagement from "../../../zustand";
import useUserStatusCheckbox from "../zustand";

export default function StatusEditorSaveButton({
  courseMember,
}: {
  courseMember: CourseMember;
}) {
  const [loading, setLoading] = useState(false);
  const { mode, notes, setNotes } = useUserStatusCheckbox();
  const { t } = useTranslation("page");
  const { users, setUsers } = useCourseManagement();

  return (
    <Button
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        if (mode === "automatic") {
          if (!courseMember.overwrittenStatus) return;
          removeOverwrittenCourseUserStatus({
            id: courseMember.overwrittenStatus.id,
          });
          setUsers(
            users.map((u) => {
              if (u.id === courseMember.id) {
                return {
                  ...u,
                  overwrittenStatus: undefined,
                };
              }
              return u;
            }),
          );
        } else {
          const result = await overwriteCourseUserStatus({
            userId: courseMember.id,
            passed: mode === "passed",
            layerId: courseMember.layerId,
            notes,
          });

          setUsers(
            users.map((u) => {
              if (u.id === courseMember.id) {
                return {
                  ...u,
                  overwrittenStatus: {
                    id: result?.id ?? "",
                    userId: courseMember.id,
                    passed: !!result?.passed,
                    notes,
                  },
                };
              }
              return u;
            }),
          );
        }
        setNotes("");
        setLoading(false);
      }}
    >
      {!loading ? t("general.save") : t("general.loading")}
    </Button>
  );
}
