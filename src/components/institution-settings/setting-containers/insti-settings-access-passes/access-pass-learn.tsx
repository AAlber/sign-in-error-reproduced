import { Video } from "lucide-react";
import { useTranslation } from "react-i18next";
import LearnMenu from "@/src/components/reusable/learn/learn-menu";

export default function AccessPassLearn() {
  const { t } = useTranslation("page");

  return (
    <LearnMenu
      description="access-pass-learn.description"
      id="access-pass-learn-menu"
      title={"access-pass-learn.title"}
      sections={[
        {
          type: "same-for-all",
          title: "video_tutorials",
          items: [
            {
              type: "video",
              url: "learn_menu.standard-access-pass.video_url",
              title: "learn_menu.standard-access-pass.title",
              icon: <Video />,
              length: "1:51",
            },
            {
              type: "video",
              url: "learn_menu.paid-access-pass.video_url",
              title: "learn_menu.paid-access-pass.title",
              icon: <Video />,
              length: "1:46",
            },
            {
              type: "video",
              url: "learn_menu.accessing-access-pass.video_url",
              title: "learn_menu.accessing-access-pass.title",
              icon: <Video />,
              length: "1:27",
            },
          ],
        },
      ]}
    >
      <LearnMenu.Trigger
        id="access-pass-learn-menu"
        focusVideo="learn_menu.standard-access-pass.video_url"
      />
    </LearnMenu>
  );
}
