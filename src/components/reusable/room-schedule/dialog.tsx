import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getAppointmentsOfRoomForDate } from "@/src/client-functions/client-institution-room";
import type { ScheduleAppointment } from "@/src/types/appointment.types";
import { amenities } from "@/src/utils/room-amenities";
import DateTimePicker from "../date-time-picker";
import Modal from "../modal";
import ScheduleHorizontalDayView from "../schedule-horizontal-day-view";
import { CardDescription, CardHeader, CardTitle } from "../shadcn-ui/card";
import { Label } from "../shadcn-ui/label";
import useRoomDialog from "./zustand";

const RoomDialog = () => {
  const { open, setOpen, room, date } = useRoomDialog();
  const { t } = useTranslation("page");
  const [loading, setLoading] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date>(
    date || new Date(),
  );
  const [appointments, setAppointments] = React.useState<ScheduleAppointment[]>(
    [],
  );
  useEffect(() => {
    if (!room) return;
    setLoading(true);
    getAppointmentsOfRoomForDate(room.id, selectedDate).then((appointments) => {
      setAppointments(appointments);
      setLoading(false);
    });
  }, [selectedDate]);

  if (!room) return null;

  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="flex flex-col gap-4">
        <CardHeader className="px-0 pb-2 pt-0">
          <CardTitle>{room?.name}</CardTitle>
          <CardDescription className="text-muted-contrast">
            {room.address}
          </CardDescription>
        </CardHeader>
        <DateTimePicker
          value={selectedDate}
          onChange={(date) => {
            setSelectedDate(date);
          }}
        />
        <ScheduleHorizontalDayView
          loading={loading}
          appointments={appointments}
          date={selectedDate}
          heigth={100}
        />
        <Label>{t("amenities")}</Label>
        {room.amenities && room.amenities.split(",").length > 0 && (
          <div className="grid grid-cols-3 gap-4 px-2 text-contrast">
            {room.amenities.split(",").map((amenity, idx) => {
              const amenityObj = amenities.find((a) => a.label === amenity);
              if (!amenityObj) return null;
              return (
                <div
                  key={idx}
                  className="flex items-center justify-start gap-2 text-center"
                >
                  <amenityObj.icon size={20} className="opacity-90" />
                  <p className="whitespace-nowrap text-xs text-muted-contrast">
                    {t(amenity)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default RoomDialog;
