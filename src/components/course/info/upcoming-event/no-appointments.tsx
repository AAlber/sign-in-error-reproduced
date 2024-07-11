import { CalendarOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toastNoSubscription } from "@/src/client-functions/client-stripe/alerts";
import { hasActiveSubscription } from "@/src/client-functions/client-stripe/data-extrapolation";
import { EmptyState } from "@/src/components/reusable/empty-state/empty-state";
import useAppointmentEditor from "../../../popups/appointment-editor/zustand";
import { Button } from "../../../reusable/shadcn-ui/button";
import useCourse from "../../zustand";

export default function NoUpcomingEvents() {
  const { hasSpecialRole, course } = useCourse();
  const { t } = useTranslation("page");
  const { init: initAppointmentCreator } = useAppointmentEditor();

  return (
    <div className="py-10">
      <EmptyState
        title="course.empty.schedule"
        description="course.empty.schedule.description"
        icon={CalendarOff}
      >
        {hasSpecialRole && (
          <>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  if (!hasActiveSubscription()) return toastNoSubscription();
                  initAppointmentCreator(
                    course?.layer_id
                      ? { layerIds: [course?.layer_id] }
                      : undefined,
                  );
                }}
              >
                {t("general.create")}
              </Button>
            </div>
            <EmptyState.Article articleId={8707603} />
          </>
        )}
      </EmptyState>
    </div>
  );
}
