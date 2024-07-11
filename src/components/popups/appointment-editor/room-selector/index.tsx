import dayjs from "dayjs";
import { Building } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getInstitutionRoomsWithAppointments } from "@/src/client-functions/client-institution-room";
import AsyncSelect from "@/src/components/reusable/async-select";
import { EmptyState } from "@/src/components/reusable/empty-state";
import useRoomDialog from "@/src/components/reusable/room-schedule/zustand";
import ScheduleHorizontalDayView from "@/src/components/reusable/schedule-horizontal-day-view";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import {
  CardDescription,
  CardHeader,
} from "@/src/components/reusable/shadcn-ui/card";
import useUser from "@/src/zustand/user";
import useAppointmentEditor from "../zustand";
import RoomOption from "./room-option";

export default function RoomSelector() {
  const { user: data } = useUser();
  const { roomId, setRoomId, dateTime, duration } = useAppointmentEditor();
  const { t } = useTranslation("page");
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const { init } = useRoomDialog();

  const isAvailable = (room: any) => {
    if (room.id === roomId) return true;
    if (!room.appointments) return true;
    const start = new Date(dateTime);
    const end = new Date(dateTime);
    end.setMinutes(end.getMinutes() + parseInt(duration));
    const appointments = room.appointments;
    for (let i = 0; i < appointments.length; i++) {
      const appointment = appointments[i];
      const appointmentStart = new Date(appointment.dateTime);
      const appointmentEnd = new Date(appointment.dateTime);
      appointmentEnd.setMinutes(
        appointmentEnd.getMinutes() + appointment.duration,
      );
      if (start >= appointmentStart && start < appointmentEnd) return false;
      if (end > appointmentStart && end <= appointmentEnd) return false;
    }
    return true;
  };

  useEffect(() => {
    if (!roomId) return;
    getInstitutionRoomsWithAppointments(data.currentInstitutionId).then(
      (rooms) => {
        const room = rooms.find((r) => r.id === roomId);
        if (!room) return;
        setRoomId(room.id);
        setSelectedRoom(room);
      },
    );
  }, [roomId]);

  return (
    <AsyncSelect
      trigger={
        <Button>{t(selectedRoom ? selectedRoom.name : "select_room")}</Button>
      }
      placeholder="appointment_modal.location_settings_select_room_placeholder"
      fetchData={async () =>
        getInstitutionRoomsWithAppointments(data.currentInstitutionId)
      }
      onSelect={(item) => {
        if (!isAvailable(item)) return;
        setRoomId(item.id);
        setSelectedRoom(item);
      }}
      searchValue={(item) => item.name + item.id}
      itemComponent={(item) => (
        <RoomOption
          isAvailable={isAvailable(item)}
          room={item}
          showAvailabilityIndicator
        />
      )}
      emptyState={
        <EmptyState
          className="p-2"
          icon={Building}
          title="room.empty.title"
          description="event.room.empty.description"
        />
      }
      renderHoverCard={true}
      hoverCard={(item) => {
        if (isAvailable(item)) return null;
        return (
          <div>
            <ScheduleHorizontalDayView
              appointments={item.appointments}
              highlightedZones={[
                {
                  dateTime: new Date(dateTime),
                  duration: parseInt(duration),
                },
              ]}
              date={dateTime}
            />
            <CardHeader className="-mt-4 flex flex-col px-0 pb-1">
              <CardDescription className="flex items-center justify-between">
                {t("room_not_available_time")} (
                {dayjs(dateTime).format("HH:mm")} -{" "}
                {dayjs(dateTime)
                  .add(parseInt(duration), "minute")
                  .format("HH:mm")}
                )
              </CardDescription>
            </CardHeader>
            <Button
              size={"small"}
              variant={"link"}
              className="mt-1 px-0"
              onClick={() => {
                init({ room: item, date: dateTime });
              }}
            >
              {t("see_other_availabilities")}
            </Button>
          </div>
        );
      }}
    />
  );
}
