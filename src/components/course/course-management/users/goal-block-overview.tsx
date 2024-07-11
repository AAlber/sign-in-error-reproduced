import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import classNames, { truncate } from "@/src/client-functions/client-utils";
import {
  HoverCard,
  HoverCardSheet,
  HoverCardTrigger,
} from "@/src/components/reusable/shadcn-ui/hover-card";

export default function BlockGoalsOverview({
  courseMember,
}: {
  courseMember: CourseMember;
}) {
  const { t } = useTranslation("page");

  const passedGoals = courseMember.prerequisitesStatus.filter(
    (goal) => goal.status === "passed",
  ).length;

  const totalGoals = courseMember.prerequisitesStatus.length;
  const allGoalsPassed = passedGoals === totalGoals;

  return (
    <HoverCard>
      <HoverCardTrigger>
        <div
          className={classNames(
            "flex items-center gap-2",
            allGoalsPassed ? "text-positive" : "text-muted-contrast",
          )}
        >
          {passedGoals}/{totalGoals}{" "}
          {allGoalsPassed && <Check className="h-4 w-4 text-positive" />}
        </div>
      </HoverCardTrigger>
      <HoverCardSheet className="max-w-[400px]">
        <div className="grid grid-cols-2 gap-1">
          {courseMember.prerequisitesStatus.map((goal) => (
            <>
              <h4 className="text-muted-contrast">
                {truncate(goal.contentBlock.name, 20)}:
              </h4>
              <span
                className={`text-end font-bold ${
                  goal.status === "failed"
                    ? "text-destructive"
                    : goal.status === "passed"
                    ? "text-positive"
                    : "text-contrast"
                }`}
              >
                {t(goal.status)}
              </span>
            </>
          ))}
        </div>
      </HoverCardSheet>
    </HoverCard>
  );
}
