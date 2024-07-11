import React from "react";
import { useTranslation } from "react-i18next";
import { getAppointmentType } from "@/src/client-functions/client-appointment";
import { Label } from "@/src/components/reusable/shadcn-ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/reusable/shadcn-ui/select";
import type { AppointmentEventType } from "@/src/types/appointment.types";
import useAppointmentEditor from "../zustand";

export const AppointmentEventTypeSelector = () => {
  const {
    setOnline,
    setHybrid,
    setRoomId,
    setAddress,
    setOnlineAddress,
    isOnline,
    isHybrid,
  } = useAppointmentEditor();
  const { t } = useTranslation("page");

  const apType = getAppointmentType({ isOnline, isHybrid });

  const handleChange = (v: AppointmentEventType) => {
    if (v === "hybrid") {
      setHybrid(true);
      setOnline(false);
      return;
    }

    if (v === "online") {
      setOnline(true);
      setHybrid(false);
      setRoomId("");
      setAddress("");
      return;
    }

    setHybrid(false);
    setOnline(false);
    setOnlineAddress("");
  };

  return (
    <>
      <Label>
        {t("appointment_modal.location_settings_appointment_type")}{" "}
      </Label>
      <Select value={apType} onValueChange={handleChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="in-person">In-person</SelectItem>
          <SelectItem value="online">Online</SelectItem>
          <SelectItem value="hybrid">Hybrid</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
};
