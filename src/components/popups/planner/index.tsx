import { RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import useSchedule from "@/src/components/schedule/zustand";
import BetaBadge from "../../reusable/badges/beta";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../reusable/shadcn-ui/card";
import { Carousel, CarouselContent } from "../../reusable/shadcn-ui/carousel";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../reusable/shadcn-ui/popover";
import { Separator } from "../../reusable/shadcn-ui/separator";
import Preferences from "./preferences";
import Selection from "./selection";
import Summary from "./summary";
import usePlanner from "./zustand";

const Planner = ({ children }) => {
  const { t } = useTranslation("page");
  const { carouselAPI, setCarouselAPI, reset } = usePlanner();
  const { appointments, setAppointments } = useSchedule();

  return (
    <Popover>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        {/* split this into its own component - AIPlannerHeader - /header.tsx */}
        <CardHeader className="px-4 pb-2 pt-4">
          <CardTitle className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1">
              {t("planner")} <BetaBadge />
            </div>
            <Button
              variant={"ghost"}
              size={"iconSm"}
              onClick={() => {
                carouselAPI?.scrollTo(0);
                reset();
                setAppointments(appointments.filter((a) => !a.type));
              }}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </CardTitle>
          <CardDescription className="pb-2">
            {t("planner-description")}
          </CardDescription>
        </CardHeader>
        <Separator />
        <Carousel
          className="h-[600px]"
          opts={{ watchDrag: false }}
          setApi={setCarouselAPI}
        >
          <CarouselContent>
            {/* Responsible for selecting the courses and their available resources */}
            <Selection />
            {/* Responsible for selecting the scheduling preferences */}
            <Preferences />
            {/* Responsible for displaying the summary of the scheduling */}
            <Summary />
          </CarouselContent>
        </Carousel>
      </PopoverContent>
    </Popover>
  );
};
Planner.displayName = "Planner";

export default Planner;
