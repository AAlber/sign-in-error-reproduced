import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AsyncSelect from "@/src/components/reusable/async-select";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import useUser from "@/src/zustand/user";
import useAppointmentEditor from "../../zustand";

export type DurationItem = {
  label: string;
  value: number;
};

export default function DurationSelector({
  value,
  onChange,
  children,
}: {
  value: number;
  onChange: (value: number) => void;
  children?: React.ReactNode;
}) {
  const [durations, setDurations] = useState<DurationItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useUser();
  const { t } = useTranslation("page");
  const [duration, setDuration] = useState<DurationItem | null>();
  const { setDuration: setAppointmentDuration } = useAppointmentEditor();

  const formatDuration = (hours, minutes) => {
    dayjs.locale(user.language);
    const hoursText = hours
      ? `${hours} ${
          dayjs().hour(hours).format("H") === "1"
            ? user.language === "de"
              ? "Stunde"
              : "hour"
            : user.language === "de"
            ? "Stunden"
            : "hours"
        }`
      : "";
    const minutesText = minutes
      ? `${minutes} ${user.language === "de" ? "min" : "min"}`
      : "";

    return `${hoursText} ${minutesText}`.trim();
  };

  const formatPlaceholderDuration = (value) => {
    if (value < 60) {
      return `${value} ${
        value === 1
          ? user.language === "de"
            ? "Minute"
            : "min"
          : user.language === "de"
          ? "Minuten"
          : "min"
      }`;
    } else {
      const hours = value / 60;
      return `${hours} ${
        hours === 1
          ? user.language === "de"
            ? "Stunde"
            : "hour"
          : user.language === "de"
          ? "Stunden"
          : "hours"
      }`;
    }
  };

  const placeholderDurations = [
    { label: formatPlaceholderDuration(15), value: 15 },
    { label: formatPlaceholderDuration(30), value: 30 },
    { label: formatPlaceholderDuration(45), value: 45 },
    { label: formatPlaceholderDuration(60), value: 60 },
    { label: formatPlaceholderDuration(120), value: 120 },
    { label: formatPlaceholderDuration(240), value: 240 },
    { label: formatPlaceholderDuration(480), value: 480 },
    { label: formatPlaceholderDuration(960), value: 960 },
  ];

  useEffect(() => {
    setDurations(placeholderDurations);
  }, []);

  useEffect(() => {
    setDuration({
      label: convertInputToDuration(value)[0]!.label,
      value: value,
    });
    setAppointmentDuration(String(value));
  }, [value]);

  const convertInputToDuration = (
    inputValue: number | string,
  ): DurationItem[] => {
    let totalMinutes = 0;
    if (
      !isNaN(parseInt(inputValue as any)) &&
      !inputValue.toString().includes(" ")
    ) {
      const numberValue = parseInt(inputValue as string, 10);
      if (numberValue > 0 && numberValue < 24) {
        // For values between 1 and 23, return both hour and minute options.
        return [
          { label: `${numberValue} min`, value: numberValue }, // Represents minutes
          {
            label: `${numberValue} hour${numberValue === 1 ? "" : "s"}`,
            value: numberValue * 60,
          }, // Represents hours
        ];
      } else if (numberValue >= 24 && numberValue < 60) {
        // If it's a valid minute value between 24 and 59
        return [{ label: `${numberValue} min`, value: numberValue }];
      } else {
        // For values 60 and above, calculate hours and minutes
        const hours = Math.floor(numberValue / 60);
        const minutes = numberValue % 60;
        return [{ label: formatDuration(hours, minutes), value: numberValue }];
      }
    } else {
      // Handle the "1 20" format
      const parts = (inputValue as string)
        .split(" ")
        .map((part) => parseInt(part, 10));
      if (parts.length === 2) {
        const [hours, minutes] = parts;
        totalMinutes = hours! * 60 + minutes!;
        return [{ label: formatDuration(hours, minutes), value: totalMinutes }];
      } else if (parts.length === 1) {
        // Assume it's either hours or minutes
        totalMinutes = parts[0]!;
        return totalMinutes < 60
          ? [{ label: `${totalMinutes} min`, value: totalMinutes }]
          : [
              {
                label: formatDuration(
                  Math.floor(totalMinutes / 60),
                  totalMinutes % 60,
                ),
                value: totalMinutes,
              },
            ];
      }
    }
    return [{ label: formatDuration(0, totalMinutes), value: totalMinutes }];
  };

  const fetchDurations = async (): Promise<DurationItem[]> => {
    if (!searchTerm) {
      return placeholderDurations;
    }

    // Check if searchTerm is numeric or "1 20" format
    if (!isNaN(parseInt(searchTerm, 10)) || searchTerm.includes(" ")) {
      return convertInputToDuration(searchTerm);
    }

    // Fallback to search in all durations if searchTerm is not a number or "1 20" format
    const searchLower = searchTerm.toLowerCase();
    const filteredDurations = durations.filter((duration) =>
      duration.label.toLowerCase().startsWith(searchLower),
    );
    return filteredDurations.length > 0 ? filteredDurations : [];
  };

  const handleSelectDuration = (item: DurationItem) => {
    setDuration(item);
    if (item.value > 1440) return onChange(1440);
    onChange(item.value);
  };

  return (
    <>
      <AsyncSelect<DurationItem>
        placeholder={t("schedule_appointment_time_duration_selector_search")}
        noDataMessage={t("schedule_appointment_time_duration_no_data")}
        side="bottom"
        fetchData={fetchDurations}
        refreshTrigger={searchTerm}
        onSelect={handleSelectDuration}
        onSearch={(search) => setSearchTerm(search.trim())}
        searchValue={(item) => String(item.value + item.label)}
        itemComponent={(item) => <div>{item.label}</div>}
        openWithShortcut={false}
        trigger={
          children ? (
            (children as React.ReactElement)
          ) : (
            <Button
              className="w-[150px] font-normal"
              onClick={() => {
                setSearchTerm("");
              }}
            >
              {duration ? duration.label : t("select")}
            </Button>
          )
        }
      />
    </>
  );
}
