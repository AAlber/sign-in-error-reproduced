import {
  Calendar,
  MessageSquare,
  PartyPopper,
  Settings2,
  Shapes,
  Users,
} from "lucide-react";
import { useEffect } from "react";
import useUser from "@/src/zustand/user";
import LearnMenu from "../reusable/learn/learn-menu";
import { useLearnDialog } from "../reusable/learn/zustand";

export default function WelcomeLearnMenu() {
  const { user } = useUser();
  const { setFocusVideo } = useLearnDialog.getState();

  useEffect(() => {
    if (user.institution?.hasAdminRole) {
      setFocusVideo("learn_menu.welcome.admin.structure.url");
    } else {
      setFocusVideo("learn_menu.welcome.student.courses.url");
    }
  }, [user]);

  return (
    <LearnMenu
      id="welcome-learn-menu"
      title="learn_menu.welcome.title"
      description="learn_menu.welcome.description"
      sections={
        user.institution?.hasAdminRole
          ? [
              {
                type: "same-for-all",
                items: [
                  {
                    url: "learn_menu.welcome.admin.structure.url",
                    title: "learn_menu.welcome.hello",
                    type: "video",
                    icon: <PartyPopper className="h-5 w-5" />,
                    length: "2:42",
                  },
                  {
                    url: "learn_menu.welcome.admin.courses.url",
                    title: "learn_menu.welcome.courses",
                    type: "video",
                    icon: <Shapes className="h-5 w-5" />,
                    length: "6:01",
                  },
                  {
                    url: "learn_menu.welcome.admin.chat.url",
                    title: "learn_menu.welcome.chat",
                    type: "video",
                    icon: <MessageSquare className="h-5 w-5" />,
                    length: "1:06",
                  },
                  {
                    url: "learn_menu.welcome.admin.calendar.url",
                    title: "learn_menu.welcome.calendar",
                    type: "video",
                    icon: <Calendar className="h-5 w-5" />,
                    length: "3:17",
                  },
                  {
                    url: "learn_menu.welcome.admin.usermgmt.url",
                    title: "learn_menu.welcome.usermgmt",
                    type: "video",
                    icon: <Users className="h-5 w-5" />,
                    length: "4:01",
                  },
                  {
                    url: "learn_menu.welcome.admin.settings.url",
                    title: "learn_menu.welcome.settings",
                    type: "video",
                    icon: <Settings2 className="h-5 w-5" />,
                    length: "1:51",
                  },
                ],
              },
            ]
          : [
              {
                type: "same-for-all",
                items: [
                  {
                    url: "learn_menu.welcome.student.courses.url",
                    title: "learn_menu.welcome.hello",
                    type: "video",
                    icon: <PartyPopper className="h-5 w-5" />,
                    length: "3:47",
                  },
                  {
                    url: "learn_menu.welcome.student.chat.url",
                    title: "learn_menu.welcome.chat",
                    type: "video",
                    icon: <MessageSquare className="h-5 w-5" />,
                    length: "1:03",
                  },
                  {
                    url: "learn_menu.welcome.student.calendar.url",
                    title: "learn_menu.welcome.calendar",
                    type: "video",
                    icon: <Calendar className="h-5 w-5" />,
                    length: "0:53",
                  },
                ],
              },
            ]
      }
    />
  );
}
