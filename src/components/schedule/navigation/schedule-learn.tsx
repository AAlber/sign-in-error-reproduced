import { PackageOpen, Video } from "lucide-react";
import type { LearnMenuSection } from "@/src/types/learn.types";
import LearnMenu from "../../reusable/learn/learn-menu";
import useSchedule from "../zustand";

export default function LearnSchedule() {
  const { canCreate } = useSchedule();
  return (
    <LearnMenu
      id="schedule-learn-menu"
      title="learn_menu.schedule.title"
      description="learn_menu.schedule.description"
      sections={[
        ...(canCreate
          ? [
              {
                type: "same-for-all",
                items: [
                  {
                    type: "video",
                    title: "learn_menu.schedule.intro.title",
                    url: "learn_menu.schedule.intro.video_url",
                    icon: <Video />,
                    length: "1:25",
                  },
                  {
                    type: "video",
                    title: "learn_menu.schedule.creation.title",
                    url: "learn_menu.schedule.creation.video_url",
                    icon: <Video />,
                    length: "1:15",
                  },
                  {
                    type: "video",
                    title: "learn_menu.schedule.filters.title",
                    url: "learn_menu.schedule.filters.video_url",
                    icon: <Video />,
                    length: "1:00",
                  },
                  {
                    type: "article",
                    articleId: 9148424,
                    title: "learn_menu.schedule.recurrence_appointment.title",
                    icon: <PackageOpen />,
                    minRead: 5,
                  },
                  {
                    type: "article",
                    articleId: 9148508,
                    title: "learn_menu.schedule.availability.title",
                    icon: <PackageOpen />,
                    minRead: 5,
                  },
                ],
              } satisfies LearnMenuSection,
            ]
          : []),
        ...(canCreate
          ? []
          : [
              {
                type: "same-for-all",
                items: [
                  {
                    type: "video",
                    title: "learn_menu.schedule.student.introduction.title",
                    url: "learn_menu.schedule.student.introduction.video_url",
                    icon: <Video />,
                    length: "0:45",
                  },
                  {
                    type: "video",
                    title: "learn_menu.schedule.student.appointment.title",
                    url: "learn_menu.schedule.student.appointment.video_url",
                    icon: <Video />,
                    length: "1:00",
                  },
                ],
              } satisfies LearnMenuSection,
            ]),
      ]}
    >
      <LearnMenu.Trigger
        id="schedule-learn-menu"
        focusVideo={
          canCreate
            ? "learn_menu.schedule.intro.video_url"
            : "learn_menu.schedule.student.introduction.video_url"
        }
      />
    </LearnMenu>
  );
}
