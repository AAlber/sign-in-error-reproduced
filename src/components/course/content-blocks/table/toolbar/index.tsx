import { Plus } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import NavigationTabs from "@/src/components/reusable/navigation-tabs";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import useUser from "@/src/zustand/user";
import CourseNewDropdown from "../../../info/course-new-button";
import useCourse, { CoursePage } from "../../../zustand";
import LearnCourse from "./learn-menu";

export default function CourseToolbar({ role }: { role: Role }) {
  const { t } = useTranslation("page");
  const { page, setPage } = useCourse();
  const allRoles = ["member", "educator", "admin", "moderator"];
  const managingRoles = allRoles.filter((r) => r !== "member");
  const { user } = useUser();
  const isFeedbackEnabled =
    user.institution?.institutionSettings?.addon_peer_feedback;

  useEffect(() => {
    if (role !== "member" && page !== CoursePage.ORGANIZER) {
      setPage(CoursePage.ORGANIZER);
    } else if (role === "member" && page !== CoursePage.LEARNING_JOURNEY) {
      setPage(CoursePage.LEARNING_JOURNEY);
    }
  }, [role]);

  const pages = [
    {
      id: CoursePage.ORGANIZER,
      tabId: "organizer",
      label: "overview",
      rolesWithAccess: managingRoles,
      visibleOn: [{ min: 700, max: Infinity }],
    },
    {
      id: CoursePage.LEARNING_JOURNEY,
      tabId: "learning_journey",
      label: "learning_journey",
      rolesWithAccess: allRoles,
      visibleOn: [{ min: 700, max: Infinity }],
    },
    ...(isFeedbackEnabled
      ? [
          {
            id: CoursePage.PEER_FEEDBACK,
            tabId: "peer_feedback",
            label: "peer_feedback.title",
            rolesWithAccess: allRoles,
            visibleOn: [{ min: 700, max: Infinity }],
          },
        ]
      : []),
    {
      id: CoursePage.USERS,
      tabId: "users",
      label: "users",
      rolesWithAccess: managingRoles,
      visibleOn: [{ min: 800, max: Infinity }],
    },
    {
      id: CoursePage.SETTINGS,
      tabId: "settings",
      label: "settings",
      rolesWithAccess: managingRoles,
      visibleOn: [{ min: 1200, max: Infinity }],
    },
  ];
  const filteredPages = pages.filter((p) => p.rolesWithAccess.includes(role));

  return (
    <div className="relative flex items-center justify-between space-x-2">
      <NavigationTabs
        tabsClassName="pb-2.5 mt-3 gap-2 flex items-center "
        contentClassName="mt-0 flex h-auto w-full flex-col justify-start gap-4 "
        initialTabId={role === "member" ? "learning_journey" : "organizer"}
        tabs={filteredPages.map((p) => ({
          tab: {
            name: t(p.label),
            id: p.tabId,
            children: <div />,
            visibleOn: p.visibleOn,
          },
          onTabChange: () => setPage(p.id),
        }))}
        resizablePopover={{
          side: "right",
        }}
      />
      <div className="flex items-center space-x-2">
        {role === "member" ? (
          <LearnCourse />
        ) : (
          <>
            <LearnCourse />
            {(page === CoursePage.ORGANIZER ||
              page === CoursePage.LEARNING_JOURNEY) && (
              <CourseNewDropdown>
                <Button variant={"cta"}>
                  <Plus className="mr-1 size-4" />
                  {t("general.create")}
                </Button>
              </CourseNewDropdown>
            )}
          </>
        )}
      </div>
    </div>
  );
}
