import React from "react";
import { useTranslation } from "react-i18next";
import { data } from "tailwindcss/defaultTheme";
import useAdministration from "@/src/components/administration/zustand";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { useGetAllUpcomingAppointments } from "@/src/components/schedule/hooks";
import useScheduleFilter from "@/src/components/schedule/zustand-filter";
import Spinner from "@/src/components/spinner";
import AppointmentItem from "../upcoming-event/appointment-item";
import NoUpcomingEventsSchedule from "./no-upcoming-event";

export const PaginatedUpcomingEvents = () => {
  const {
    loading: initialLoading,
    allUpcomingAppointments: appointments,
    nextPage,
    nextPageLoading,
    pagination,
  } = useGetAllUpcomingAppointments();
  const { t } = useTranslation("page");

  const filteredLayers = useScheduleFilter((state) => state.filteredLayers);
  const isLayerAChildOf = useAdministration((state) => state.isLayerAChildOf);

  const filteredAppointments = !!filteredLayers.length
    ? appointments.filter(({ appointmentLayers }) =>
        appointmentLayers.some(
          ({ layer }) =>
            filteredLayers.includes(layer.id) ||
            filteredLayers.some((parentId) =>
              isLayerAChildOf(layer.id, parentId),
            ),
        ),
      )
    : appointments;

  return (
    <>
      {!initialLoading || nextPageLoading ? (
        <div className="relative flex size-full flex-col items-start gap-2 overflow-hidden">
          <p className="px-4 font-semibold text-contrast">
            {t("course_appointments_display_upcoming_events")}
          </p>
          {data && (
            <>
              <div className="flex size-full flex-col">
                <div className="flex size-full flex-col gap-3 px-4">
                  {!!filteredAppointments.length ? (
                    <div>
                      {filteredAppointments.map((appointment) => {
                        return (
                          <AppointmentItem
                            appointments={filteredAppointments}
                            key={appointment.id}
                            appointment={appointment}
                            isNextAppointment={true}
                          />
                        );
                      })}
                      {pagination &&
                        pagination.currentPage < pagination.totalPages && (
                          <Button
                            disabled={nextPageLoading}
                            onClick={nextPage}
                            variant="link"
                            className="mt-2 w-[calc(100%-16px)]"
                          >
                            {nextPageLoading ? (
                              <Spinner size="w-4 h-4" />
                            ) : (
                              <>
                                {t(
                                  "course_members_display_members_search_load_more",
                                )}
                              </>
                            )}
                          </Button>
                        )}
                    </div>
                  ) : (
                    <div className="mt-10">
                      <NoUpcomingEventsSchedule />
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <Spinner size="w-8 h-8" />
        </div>
      )}
    </>
  );
};
