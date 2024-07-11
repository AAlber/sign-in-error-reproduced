import { Video } from "lucide-react";
import LearnMenu from "../../reusable/learn/learn-menu";

export default function LearnStructure() {
  return (
    <LearnMenu
      id="structure-learn-menu"
      title="learn_menu.structure.title"
      description="learn_menu.structure.description"
      sections={[
        {
          type: "same-for-all",
          // requiredAccess: {
          //   rolesWithAccess: ["admin"],
          //   layerIds: [""],
          // },
          items: [
            {
              title: "learn_menu.structure.create_course.title",
              type: "video",
              icon: <Video />,
              url: "learn_menu.structure.create_course.video_url",
              length: "0:41",
            },
            {
              title: "learn_menu.structure.layer_discovery",
              type: "video",
              icon: <Video />,
              url: "learn_menu.structure.layer_discovery.video_url",
              length: "0:45",
            },
            {
              title: "learn_menu.structure.access_control",
              type: "video",
              icon: <Video />,
              url: "learn_menu.structure.access_control.video_url",
              length: "1:18",
            },
            {
              title: "learn_menu.structure.timing",
              type: "video",
              icon: <Video />,
              url: "learn_menu.structure.timing.video_url",
              length: "1:01",
            },
            {
              title: "learn_menu.structure.mirrored_courses",
              type: "video",
              icon: <Video />,
              url: "learn_menu.structure.mirrored_courses.video_url",
              length: "1:52",
            },
          ],
        },
      ]}
    >
      <LearnMenu.Trigger
        id="structure-learn-menu"
        focusVideo="learn_menu.structure.create_course.video_url"
      />
    </LearnMenu>
  );
}
