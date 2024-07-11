import { Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toastNoSubscription } from "@/src/client-functions/client-stripe/alerts";
import { hasActiveSubscription } from "@/src/client-functions/client-stripe/data-extrapolation";
import useAppointmentEditor from "@/src/components/popups/appointment-editor/zustand";
import { DropdownMenuItem } from "../../../reusable/shadcn-ui/dropdown-menu";
import useCourse from "../../zustand";

export default function NewAppointment() {
  const { init: initAppointmentCreator } = useAppointmentEditor();
  const { course } = useCourse();
  const { t } = useTranslation("page");

  return (
    <DropdownMenuItem
      onClick={() => {
        if (!hasActiveSubscription()) return toastNoSubscription();
        initAppointmentCreator(
          course?.layer_id ? { layerIds: [course?.layer_id] } : undefined,
        );
      }}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background">
        <Calendar
          size={16}
          className="flex w-[1.15rem] justify-center text-contrast"
        />
      </div>
      <div className="flex flex-col">
        {t("appointment")}
        <span className="text-xs text-muted-contrast">
          {t("appointment-description")}
        </span>
      </div>
    </DropdownMenuItem>
  );
}
