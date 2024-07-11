import { PackageOpen, Video } from "lucide-react";
import LearnMenu from "@/src/components/reusable/learn/learn-menu";

export default function LearnUserManagement() {
  return (
    <LearnMenu
      id="user-management-learn-menu"
      title="learn_menu.user_management.title"
      description="learn_menu.user_management.description"
      sections={[
        {
          type: "same-for-all",
          items: [
            {
              type: "video",
              url: "learn_menu.user_management.intro.video_url",
              title: "learn_menu.user_management.intro.title",
              icon: <Video />,
              length: "1:30",
            },
            {
              type: "video",
              url: "learn_menu.user_management.create.video_url",
              title: "learn_menu.user_management.create.title",
              icon: <Video />,
              length: "0:47",
            },
            {
              type: "video",
              url: "learn_menu.user_management.custom_data.video_url",
              title: "learn_menu.user_management.custom_data",
              icon: <Video />,
              length: "2:00",
            },
            {
              type: "video",
              url: "learn_menu.user_management.select_users.video_url",
              title: "learn_menu.user_management.selct_users",
              icon: <Video />,
              length: "1:11",
            },
            {
              type: "video",
              url: "learn_menu.user_management.user_profile.video_url",
              title: "learn_menu.user_management.user_profile",
              icon: <Video />,
              length: "1:20",
            },
            {
              type: "article",
              title: "learn_menu.user_management.user_status",
              articleId: 8683928,
              icon: <PackageOpen />,
              minRead: 2,
            },
            {
              type: "article",
              title: "learn_menu.user_management.create_groups",
              articleId: 9184766,
              icon: <PackageOpen />,
              minRead: 2,
            },
          ],
        },
      ]}
    >
      <LearnMenu.Trigger
        id="structure-learn-menu"
        focusVideo="learn_menu.user_management.intro.video_url"
      />
    </LearnMenu>
  );
  // (
  //   <LearnMenu title="learn_menu.user_management.title">
  //     <LearnMenu.Video
  //       title="learn_menu.user_management.intro.title"
  //       description="learn_menu.user_management.intro.description"
  //       url="learn_menu.user_management.intro.video_url"
  //     />
  //     <LearnMenu.Article
  //       title="learn_menu.user_management.manage_access"
  //       articleId={8683928}
  //     />
  //     <LearnMenu.Article
  //       title="learn_menu.user_management.user_status"
  //       articleId={8680906}
  //     />
  //     <LearnMenu.Article
  //       title="learn_menu.user_management.custom_data"
  //       articleId={8684060}
  //     />
  //   </LearnMenu>
  // );
}
