import { useEffect, useRef } from "react";

const useScrollToCurrentHour = (date, open) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      const currentHour = date.getHours();

      const hourBlock = scrollContainerRef.current?.querySelector(
        `[data-hour="${currentHour}"]`,
      );

      if (hourBlock) {
        hourBlock.scrollIntoView({
          behavior: "instant" as any,
          inline: "start",
        });
      }
    }, 1);
  }, [date, open]);

  return scrollContainerRef;
};

export default useScrollToCurrentHour;
