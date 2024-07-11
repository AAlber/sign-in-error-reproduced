import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import BetaBadge from "../reusable/badges/beta";
import { Button } from "../reusable/shadcn-ui/button";
import useSchedule from "../schedule/zustand";

const PlannerHeader = () => {
  const { t } = useTranslation("page");
  const setPlannerOpen = useSchedule((state) => state.setPlannerOpen);

  return (
    <div className="sticky top-0 flex h-[33px] items-center justify-between border-b border-border bg-background p-4">
      <div className="flex flex-col gap-0">
        <h2 className="flex items-center text-sm">
          {t("planner")} <BetaBadge />
        </h2>
      </div>
      <Button
        variant={"ghost"}
        size={"iconSm"}
        onClick={() => setPlannerOpen(false)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
PlannerHeader.displayName = "PlannerHeader";

export { PlannerHeader };
