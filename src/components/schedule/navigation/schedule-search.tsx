import dayjs from "dayjs";
import { CalendarOff } from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { selectCurrentWeek } from "@/src/client-functions/client-schedule";
import api from "@/src/pages/api/api";
import type {
  PaginatedAppointments,
  ScheduleAppointment,
} from "@/src/types/appointment.types";
import { log } from "@/src/utils/logger/logger";
import { AsyncSearch } from "../../reusable/async-search";
import { EmptyState } from "../../reusable/empty-state";
import { Input } from "../../reusable/shadcn-ui/input";
import useSchedule from "../zustand";

export const ScheduleSearch = () => {
  const [totalPages, setTotalPages] = useState(1);
  const { t } = useTranslation("page");
  const {
    setSelectedDay,
    setShouldScrollToExactTime,
    setSelectedAppointmentFromSearch,
    allUpcomingAppointments,
    loading,
  } = useSchedule();

  const handleSelect = async (appointment: ScheduleAppointment) => {
    log.click("Clicked on searched schedule event", { data: appointment });
    setSelectedAppointmentFromSearch(appointment);
    const date = new Date(appointment.dateTime);
    setSelectedDay(date);
    selectCurrentWeek(date);
    setShouldScrollToExactTime(true);
  };

  const handleFetchData = async (value: string, page: number) => {
    const req = await fetch(
      `${api.searchAppointments}?searchTerm=${value}&page=${page}`,
    );
    if (req.ok) {
      const data = (await req.json()) as PaginatedAppointments;
      setTotalPages(data.pagination.totalPages);
      return data.appointments;
    }
    return [];
  };

  return (
    <AsyncSearch
      side="bottom"
      totalPages={totalPages}
      trigger={
        <Input
          onClick={() => {
            log.click("Opened schedule search");
          }}
          readOnly
          type="text"
          placeholder={t("general.search")}
        />
      }
      placeholder={t("general.search.appointments")}
      fetchData={handleFetchData}
      onSelect={handleSelect}
      searchValue={(appointment) => `${appointment.title} ${appointment.id}`}
      initialValuesLoading={loading}
      initialValues={allUpcomingAppointments}
      initialValuesEmptyState={() => {
        return (
          <EmptyState
            title="course.empty.schedule"
            description="schedule.empty.description"
            icon={CalendarOff}
          />
        );
      }}
      itemComponent={(appointment) => {
        return (
          <div key={appointment.id} className="flex w-full flex-col gap-1">
            <span className="text-sm font-medium">{appointment.title}</span>
            <span className="text-xs text-muted-contrast">
              {dayjs(appointment.dateTime).format("DD. MMM HH:mm")}
            </span>
          </div>
        );
      }}
    />
  );
};
