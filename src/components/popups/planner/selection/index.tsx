import { ChevronRight, RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { CarouselItem } from "@/src/components/reusable/shadcn-ui/carousel";
import useSchedule from "@/src/components/schedule/zustand";
import useUser from "@/src/zustand/user";
import usePlanner from "../zustand";
import CourseSelection from "./course-async-selection";
import OrganizerSelection from "./organizer-selection";
import RoomSelection from "./room-selection";

export default function Selection() {
  const { user } = useUser();
  const { t } = useTranslation("page");
  const { carouselAPI, organizers, course, reset } = usePlanner();
  const { appointments, setAppointments } = useSchedule();

  return (
    <CarouselItem className="mt-0 h-[600px] pb-14">
      <div className="h-full overflow-y-scroll px-4">
        {/* Select a course to schedule appointments for */}
        <CourseSelection />
        {/* Select organizers available for this course */}
        <OrganizerSelection />
        {/* Select rooms available for this course */}
        {user.institution?.institutionSettings.addon_room_management && (
          <RoomSelection />
        )}
      </div>
      <div className="flex items-center gap-2 border-t border-border p-3">
        <Button
          className="w-full"
          onClick={() => {
            carouselAPI?.scrollTo(0);
            reset();
            setAppointments(appointments.filter((a) => !a.type));
          }}
        >
          <RotateCcw className="mr-1 h-4 w-4" />
          {t("general.reset")}
        </Button>
        <Button
          disabled={organizers.length < 1 || !course}
          className="w-full"
          onClick={() => carouselAPI?.scrollNext()}
        >
          {t("planner.selection.next")}
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </CarouselItem>
  );
}
