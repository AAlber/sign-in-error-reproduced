import { useTranslation } from "react-i18next";
import { Label } from "@/src/components/reusable/shadcn-ui/label";
import Stars from "../../feedback/stars";

export const StarsComponent = ({
  score,
  setScore,
}: {
  score: number;
  setScore: (n: number) => void;
}) => {
  const { t } = useTranslation("page");

  return (
    <div className="flex flex-col gap-2">
      <Label>{t("course_main_content_feedbacks_rate_task")}</Label>
      <div className="flex h-8 items-center justify-between space-y-1 rounded-md border border-border p-2 text-sm">
        <Stars score={score} onClick={(n: number) => setScore(n + 1)} />
      </div>
    </div>
  );
};
