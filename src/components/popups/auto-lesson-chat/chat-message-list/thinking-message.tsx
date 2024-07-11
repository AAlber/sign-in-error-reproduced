import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function ThinkingMessage() {
  const [dots, setDots] = useState(".");
  const { t } = useTranslation("page");
  // useeffect to animate the thinking message with the three dots
  useEffect(() => {
    const interval = setInterval(() => {
      switch (dots) {
        case "...":
          setDots(".");
          break;
        case "..":
          setDots("...");
          break;
        case ".":
          setDots("..");
          break;
      }
    }, 500);
    return () => clearInterval(interval);
  }, [dots]);

  return (
    <div className="flex w-full items-end justify-start gap-2">
      <div className="max-w-[75%] overflow-hidden rounded-b-lg rounded-r-lg bg-accent text-muted-contrast">
        <div className="p-1.5">
          {t("ai_thinking")}
          {dots}
        </div>
      </div>
    </div>
  );
}
