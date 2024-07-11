import clsx from "clsx";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import type { Layer } from "@/src/components/administration/types";

dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "a few seconds",
    m: "a minute",
    mm: "%d minutes",
    h: "an hour",
    hh: "%d hours",
    d: "a day",
    dd: "%d days",
    M: "30 days", // Override to show 30 days instead of "a month"
    MM: "%d months",
    y: "a year",
    yy: "%d years",
  },
});

dayjs.updateLocale("de", {
  relativeTime: {
    future: "in %s",
    past: "vor %s",
    s: "ein paar Sekunden",
    m: "einer Minute",
    mm: "%d Minuten",
    h: "einer Stunde",
    hh: "%d Stunden",
    d: "einem Tag",
    dd: "%d Tagen",
    M: "30 Tagen", // Override to show 30 days instead of "a month"
    MM: "%d Monaten",
    y: "einem Jahr",
    yy: "%d Jahren",
  },
});

export const LayerDeletionDeadline = ({ layer }: { layer: Layer }) => {
  const deletionDeadline = dayjs(layer.deletedAt).add(30, "days");
  const currentTime = dayjs();
  const remainingDuration = dayjs.duration(deletionDeadline.diff(currentTime));
  const isInLastDay = remainingDuration.asDays() < 1;

  let timeRemainingFormatted: string;
  if (remainingDuration.asDays() >= 1) {
    timeRemainingFormatted = remainingDuration.humanize();
  } else if (remainingDuration.asHours() >= 1) {
    timeRemainingFormatted = remainingDuration.humanize();
  } else {
    timeRemainingFormatted = remainingDuration.humanize();
  }

  return (
    <p className={clsx(isInLastDay && "text-destructive")}>
      {timeRemainingFormatted}
    </p>
  );
};
