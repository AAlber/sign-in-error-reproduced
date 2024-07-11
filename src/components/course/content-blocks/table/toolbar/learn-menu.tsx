import { Folder, Map, Route, Users, Video } from "lucide-react";
import LearnMenu from "@/src/components/reusable/learn/learn-menu";
import useCourse from "../../../zustand";

export default function LearnCourse() {
  const { course, hasSpecialRole } = useCourse();
  return (
    <LearnMenu
      id="course-learn-menu"
      title="learn_menu.course.title"
      description="learn_menu.course.description"
      sections={[
        {
          type: "role-based",
          requiredAccess: {
            layerIds: [course.layer_id],
            rolesWithAccess: ["admin", "moderator", "educator"],
          },
          items: [
            {
              url: "learn_menu.course.create.video_url",
              title: "learn_menu.course.create.title",
              type: "video",
              icon: <Map className="h-5 w-5" />,
              length: "2:08",
            },
            {
              url: "learn_menu.course.structure.video_url",
              title: "learn_menu.course.structure.title",
              type: "video",
              icon: <Route className="h-5 w-5" />,
              length: "4:45",
            },
            {
              title: "learn_menu.course.settings.title",
              type: "video",
              icon: <Users className="h-5 w-5" />,
              length: "1:50",
              url: "learn_menu.course.settings.video_url",
            },
            {
              url: "learn_menu.course.drive.video_url",
              title: "learn_menu.course.drive.title",
              type: "video",
              icon: <Folder className="h-5 w-5" />,
              length: "1:43",
            },
          ],
        },
        {
          title: "learn_menu.course.student.items.title",
          type: "role-based",
          requiredAccess: {
            layerIds: [course.layer_id],
            rolesWithAccess: ["member"],
          },
          items: [
            {
              url: "learn_menu.course.student.overview.video.url",
              title: "learn_menu.course.student.overview.title",
              type: "video",
              icon: <Video className="h-5 w-5" />,
              length: "1:25",
            },
            {
              url: "learn_menu.course.student.learning_journey.video.url",
              title: "learn_menu.course.student.learning_journey.title",
              type: "video",
              icon: <Video className="h-5 w-5" />,
              length: "2:35",
            },
            {
              url: "learn_menu.course.student.drive.video_url",
              title: "learn_menu.course.student.drive.title",
              type: "video",
              icon: <Folder className="h-5 w-5" />,
              length: "0:31",
            },
          ],
        },
      ]}
    >
      <LearnMenu.Trigger
        id="course-learn-menu"
        focusVideo={
          hasSpecialRole
            ? "learn_menu.course.create.video_url"
            : "learn_menu.course.student.overview.video.url"
        }
      />
    </LearnMenu>
  );
}
