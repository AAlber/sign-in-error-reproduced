import React from "react";
import { AppointmentAttendees } from "./appointment-attendees";
import AppointmentOrganizerSelector from "./appointment-organizer-selector";

export const AppointmentUsers = () => {
  return (
    <div className="flex flex-col gap-2">
      <AppointmentOrganizerSelector />
      <AppointmentAttendees />
    </div>
  );
};
