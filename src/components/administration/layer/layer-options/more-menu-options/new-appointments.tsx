import { CalendarPlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toastNoSubscription } from "@/src/client-functions/client-stripe/alerts";
import { hasActiveSubscription } from "@/src/client-functions/client-stripe/data-extrapolation";
import { DropdownMenuItem } from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import useAppointmentEditor from "../../../../popups/appointment-editor/zustand";

export default function LayerOptions({ layer }: any) {
  const { init: initAppointmentCreator } = useAppointmentEditor();
  const { t } = useTranslation("page");

  return (
    <DropdownMenuItem
      data-testid="button-option-appointments"
      className="flex w-full px-2 "
      onClick={() => {
        if (!hasActiveSubscription()) return toastNoSubscription();
        initAppointmentCreator({ layerIds: [layer.id] });
      }}
    >
      <CalendarPlus className="h-4 w-4 text-contrast" />
      <span className="text-sm text-contrast">
        {t("admin_dashboard.layer_options_new_appointment")}
      </span>
    </DropdownMenuItem>
  );
}
