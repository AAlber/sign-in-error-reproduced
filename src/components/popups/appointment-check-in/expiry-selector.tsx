import dayjs from "dayjs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { updateAttendenceKeyValidity } from "@/src/client-functions/client-appointment-attendence";
import useUser from "@/src/zustand/user";
import { Label } from "../../reusable/shadcn-ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../../reusable/shadcn-ui/select";
import useAppointmentCheckInModal from "./zustand";

export default function ExpirySelector() {
  const { appointment, key, setKey, setIsFetchingToken, setIsListening } =
    useAppointmentCheckInModal();

  const getLabelFromValue = (value: ValiditySelection["value"]) => {
    return validitySelection.find((v) => v.value === value)!.label;
  };

  const validitySelection = [
    {
      value: "WHOLE_DAY",
      label: "whole-day",
    },
    {
      value: "EVENT_DURATION",
      label: "during-event-duration",
    },
    {
      value: "H1_BEFORE_AFTER",
      label: "hour-before-after",
    },
    {
      value: "ROTATING_QR",
      label: "rotating-qr",
    },
  ] as const;

  type ValiditySelection = (typeof validitySelection)[number];
  const [validity, setValidity] = useState<ValiditySelection | null>(null);

  const { user } = useUser();
  const { t } = useTranslation("page");
  dayjs.locale(user.language);

  if (!key) return null;
  return (
    <div className="flex flex-col gap-2">
      <Label>{t("valid-for")}</Label>
      <Select
        value={key.validity}
        onValueChange={async (value) => {
          const clone = validity ? { ...validity } : null;
          const v = validitySelection.find((time) => time.value === value);
          if (!v) return;

          const isRotatingQr = v.value === "ROTATING_QR";

          setValidity(v);
          setKey({
            appointmentId: appointment.id,
            expireAfterMinutes: isRotatingQr ? 15 : 0,
            key: v.value,
            id: key.id,
            validity: v.value,
          });

          setIsFetchingToken(isRotatingQr);
          setIsListening(isRotatingQr);

          const success = await updateAttendenceKeyValidity(
            appointment.id,
            v.value,
          );

          if (!success) setValidity(clone);
        }}
      >
        <SelectTrigger>
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <span>
                {t(
                  (key.validity && getLabelFromValue(key.validity)) ||
                    validity?.label,
                ) ?? "Select Validity"}
              </span>
            </div>
          </div>
        </SelectTrigger>
        <SelectContent>
          {validitySelection.map((time) => (
            <SelectItem
              key={time.value}
              value={time.value}
              className="flex w-full items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span>{t(time.label)}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
