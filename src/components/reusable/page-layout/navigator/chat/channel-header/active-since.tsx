import "dayjs/plugin/updateLocale";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

const ActiveSince: React.FC<{ isOnline: boolean; lastActive?: string }> = (
  props,
) => {
  const { isOnline, lastActive } = props;
  const { t } = useTranslation("page");
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
      M: "a month",
      MM: "%d months",
      y: "a year",
      yy: "%d years",
    },
  });

  if (!lastActive) return null;
  return (
    <span className="text-xs text-muted-contrast">
      {isOnline
        ? "Online"
        : `Last seen ${dayjs(new Date(lastActive)).fromNow()}`}
    </span>
  );
};

export default ActiveSince;
