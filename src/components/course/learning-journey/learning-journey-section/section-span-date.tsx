import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import type { ContentBlock } from "@/src/types/course.types";

export const SectionDaySpanDate = ({ block }: { block: ContentBlock }) => {
  const { t } = useTranslation("page");
  const blockHasStarted =
    block.startDate && dayjs().isAfter(dayjs(block.startDate));
  const blockHasEnded = block.dueDate && dayjs().isAfter(dayjs(block.dueDate));

  if (!block.startDate && !block.dueDate) return null;

  if (!blockHasStarted && !blockHasEnded) {
    return (
      <p className="mt-2 w-full max-w-[250px] text-center text-xs">
        {t("starts_on", { start: dayjs(block.startDate).format("DD.MM.YYYY") })}
      </p>
    );
  }

  if (!blockHasEnded && blockHasStarted) {
    return (
      <p className="mt-2 w-full max-w-[250px] text-center text-xs">
        {t("ends_on", { end: dayjs(block.dueDate).format("DD.MM.YYYY") })}
      </p>
    );
  }

  if (blockHasEnded) {
    return (
      <p className="mt-2 w-full max-w-[250px] text-center text-xs">
        {t("ended_on", { end: dayjs(block.dueDate).format("DD.MM.YYYY") })}
      </p>
    );
  }

  return null;
};
