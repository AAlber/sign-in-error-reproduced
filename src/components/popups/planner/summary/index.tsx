import dayjs from "dayjs";
import {
  CalendarX,
  Check,
  CheckCheck,
  ChevronLeft,
  Eye,
  RotateCcw,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { EmptyState } from "@/src/components/reusable/empty-state";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { CarouselItem } from "@/src/components/reusable/shadcn-ui/carousel";
import WithToolTip from "@/src/components/reusable/with-tooltip";
import useSchedule from "@/src/components/schedule/zustand";
import { SummaryDataEditor } from "../../../planner/constraints-input/summary/summary-data-editor";
import {
  acceptAllDraftAppointments,
  acceptDraftAppointment,
  declineAllDraftAppointments,
  declineDraftAppointment,
  goToDraftAppointment,
} from "../../../planner/functions";
import usePlanner from "../zustand";

export default function Summary() {
  const { t } = useTranslation("page");
  const { draftAppointments, carouselAPI, reset, setMessages } = usePlanner();
  const { appointments, setAppointments } = useSchedule();

  return (
    <CarouselItem className="mt-0 h-[600px] pb-14">
      <div className="h-full divide-y divide-border overflow-y-scroll">
        {draftAppointments.length === 0 && (
          <EmptyState
            icon={CalendarX}
            title={t("planner.summary.empty_state")}
            description={t("planner.summary.empty_state.desc")}
          />
        )}
        {draftAppointments.map((appointment) => {
          return (
            <div
              key={appointment.id}
              className="flex items-start justify-between py-2 pl-6 pr-5"
            >
              {" "}
              <div
                key={appointment.id}
                className="flex flex-col text-sm text-contrast"
              >
                {appointment.title}
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
      <div className="flex items-center gap-2 border-t border-border p-3">
        {draftAppointments.length > 0 && (
          <>
            <Button size={"icon"} onClick={() => carouselAPI?.scrollPrev()}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button className="flex-1" onClick={declineAllDraftAppointments}>
              <X className="mr-1 h-4 w-4 text-destructive" />
              {t("planner.decline_all")}
            </Button>
            <Button className="flex-1" onClick={acceptAllDraftAppointments}>
              <CheckCheck className="mr-1 h-4 w-4 text-positive" />
              {t("planner.accept_all")}
            </Button>
          </>
        )}
        {draftAppointments.length === 0 && (
          <>
            <Button
              className="w-full"
              onClick={() => {
                carouselAPI?.scrollTo(1);
              }}
            >
              <SlidersHorizontal className="mr-1 h-4 w-4" />
              {t("planner.summary.empty_state.preferences")}
            </Button>
            <Button
              className="w-full"
              onClick={() => {
                reset();
                carouselAPI?.scrollTo(0);
                setAppointments(appointments.filter((a) => !a.type));
                setMessages([]);
              }}
            >
              <RotateCcw className="mr-1 h-4 w-4" />
              {t("planner.summary.empty_state.reset")}
            </Button>
          </>
        )}
      </div>
    </CarouselItem>
  );
}
