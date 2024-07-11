import dayjs from "dayjs";
import { CalendarX, Check, CheckCheck, Eye, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { EmptyState } from "@/src/components/reusable/empty-state";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import WithToolTip from "@/src/components/reusable/with-tooltip";
import {
  acceptAllDraftAppointments,
  acceptDraftAppointment,
  declineAllDraftAppointments,
  declineDraftAppointment,
  goToDraftAppointment,
} from "../../functions";
import usePlanner from "../../zustand";
import { SummaryDataEditor } from "./summary-data-editor";

export default function Summary() {
  const { t } = useTranslation("page");
  const draftAppointments = usePlanner((state) => state.draftAppointments);
  return (
    <>
      <div className="h-full divide-y divide-border overflow-y-scroll">
        {draftAppointments.length === 0 && (
          <EmptyState
            icon={CalendarX}
            title={t("planner.summary.empty_state")}
            description={t("planner.summary.empty_state.desc")}
            className="py-6"
          />
        )}
        {draftAppointments.map((appointment) => {
          return (
            <div
              key={appointment.id}
              className="flex items-start justify-between py-2"
            >
              {" "}
              <div
                key={appointment.id}
                className="flex flex-col px-2 text-sm text-contrast"
              >
                {t(appointment.appointmentLayers[0]!.layer.name)}
                <div className="flex flex-col gap-x-2 text-xs text-muted-contrast">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <SummaryDataEditor
                        type="date"
                        id={appointment.id}
                        data={appointment.dateTime}
                      >
                        <span>
                          {dayjs(appointment.dateTime).format("DD.MM.YY")}
                        </span>
                      </SummaryDataEditor>
                      <SummaryDataEditor
                        type="time"
                        id={appointment.id}
                        data={appointment.dateTime}
                      >
                        <span>
                          {dayjs(appointment.dateTime).format("HH:mm")}
                        </span>
                      </SummaryDataEditor>
                    </div>
                    <SummaryDataEditor
                      type="duration"
                      id={appointment.id}
                      data={appointment.duration}
                    >
                      <span>{appointment.duration} min</span>
                    </SummaryDataEditor>
                  </div>
                  <div className="flex items-center gap-2">
                    <WithToolTip text="planner.address_tool_tip" side="right">
                      <span>
                        {appointment.isOnline
                          ? "Online"
                          : appointment.room?.name}
                      </span>
                    </WithToolTip>
                    <SummaryDataEditor
                      type="organizer"
                      id={appointment.id}
                      data={appointment.organizerData?.map((o) => o.name)}
                    >
                      <span>
                        {appointment.organizerData?.map((o) => o.name)}
                      </span>
                    </SummaryDataEditor>
                  </div>
                </div>
              </div>
              <div>
                <WithToolTip text="planner.accept" delay={300}>
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    className="hover:bg-muted/50"
                    onClick={async () => acceptDraftAppointment(appointment)}
                  >
                    <Check className="h-4 w-4 text-positive" />
                  </Button>
                </WithToolTip>
                <WithToolTip text="planner.decline" delay={300}>
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    className="hover:bg-muted/50"
                    onClick={() => declineDraftAppointment(appointment)}
                  >
                    <X className="h-4 w-4 text-muted-contrast" />
                  </Button>
                </WithToolTip>
                <WithToolTip text="planner.view" delay={300}>
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    className="hover:bg-muted/50"
                    onClick={() => goToDraftAppointment(appointment)}
                  >
                    <Eye className="h-4 w-4 text-muted-contrast" />
                  </Button>
                </WithToolTip>
              </div>
            </div>
          );
        })}
      </div>
      {draftAppointments.length > 0 && (
        <div className="flex items-center gap-2 border-t border-border p-3">
          <>
            <Button className="flex-1" onClick={declineAllDraftAppointments}>
              <X className="mr-1 h-4 w-4 text-destructive" />
              {t("planner.decline_all")}
            </Button>
            <Button className="flex-1" onClick={acceptAllDraftAppointments}>
              <CheckCheck className="mr-1 h-4 w-4 text-positive" />
              {t("planner.accept_all")}
            </Button>
          </>
        </div>
      )}
    </>
  );
}
