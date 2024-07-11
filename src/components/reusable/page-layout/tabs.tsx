import { Building2, ListTree, Shapes, Users } from "lucide-react";
import structureHandler from "@/src/client-functions/client-administration/structure-handler";
import type { UserData } from "@/src/types/user-data.types";
import AdministrationTree from "../../administration";
import AdministrationToolbar from "../../administration/header";
import CourseContent from "../../course";
import CourseToolbar from "../../course/content-blocks/table/toolbar";
import CourseTile from "../../course/course-tile";
import CourseTileBox from "../../course/course-tile/tile-box";
import InstitutionSettings from "../../institution-settings";
import InstitutionSettingsTab from "../../institution-settings/tab";
import getInstitutionSettingsTabs from "../../institution-settings/tabs";
import InstitutionUserManagement from "../../institution-user-management";
import { DataTableToolbar } from "../../institution-user-management/data-table/toolbar";
import Skeleton from "../../skeleton";

export enum Page {
  COURSES = 0,
  ADMINISTRATION = 1,
  INSTITUTION_USERMANAGEMENT = 2,
  INSTITUTION_SETTINGS = 3,
  CALENDAR = 4,
}

export const tabs = (user: UserData): NavigationTab[] => [
  {
    title: "navbar.your_courses",
    page: Page.COURSES,
    icon: <Shapes size={18} />,
    navigationType: "async-sub-navigation",
    skeletonComponent: (
      <CourseTileBox className="border border-border">
        <Skeleton />
      </CourseTileBox>
    ),
    getSubNavigationTabs: async () => {
      const data = await structureHandler.get.userCoursesWithProgressData();
      if (!data) return [];
      return data.courses.map((course) => ({
        id: course.layer_id,
        searchValue: course.name,
        type: "tab",
        tabComponent: (isActive) => (
          <CourseTile
            key={course.layer_id}
            course={course}
            isActive={isActive}
          />
        ),
        displayComponent: <CourseContent course={course} />,
        actionbarComponent: <CourseToolbar role={course.role} />,
      }));
    },
  },
  ...(user.institution &&
  ["admin", "moderator"].includes(user.institution.highestRole as Role)
    ? [
        {
          title: "navbar.administration",
          page: Page.ADMINISTRATION,
          icon: <ListTree size={18} />,
          navigationType: "no-sub-navigation",
          displayComponent: <AdministrationTree />,
          actionbarComponent: <AdministrationToolbar />,
        } satisfies NavigationTab,
      ]
    : []),
  ...(user.institution && user.institution.highestRole === "admin"
    ? [
        {
          title: "navbar.user_management",
          page: Page.INSTITUTION_USERMANAGEMENT,
          icon: <Users size={18} />,
          navigationType: "no-sub-navigation",
          displayComponent: <InstitutionUserManagement />,
          actionbarComponent: <DataTableToolbar />,
        } satisfies NavigationTab,
        {
          title: "navbar.organization_settings",
          page: Page.INSTITUTION_SETTINGS,
          icon: <Building2 size={18} />,
          navigationType: "static-sub-navigation",
          subNavigationTabs: getInstitutionSettingsTabs()
            .map((tab) => {
              if (tab.type === "menu") {
                return [
                  {
                    id: tab.name,
                    type: "divider",
                    component: (
                      <InstitutionSettingsTab type="divider" tab={tab} />
                    ),
                  } satisfies SubNavigationElement,
                  ...(tab.tabs.map(
                    (item) =>
                      ({
                        id: item.name,
                        searchValue: item.name,
                        type: "tab",
                        tabComponent: (isActive) => (
                          <InstitutionSettingsTab
                            type="tab"
                            tab={item}
                            isActive={isActive}
                          />
                        ),
                        displayComponent: (
                          <InstitutionSettings tabId={item.id} />
                        ),
                        actionbarComponent: <></>,
                      }) as SubNavigationElement,
                  ) satisfies SubNavigationElement[]),
                ] satisfies SubNavigationElement[];
              } else {
                return {
                  id: tab.name,
                  searchValue: tab.name,
                  type: "tab",
                  tabComponent: (isActive) => (
                    <InstitutionSettingsTab
                      type="tab"
                      tab={tab}
                      isActive={isActive}
                    />
                  ),
                  displayComponent: <InstitutionSettings tabId={tab.id} />,
                  actionbarComponent: <></>,
                } as SubNavigationElement;
              }
            })
            .flat(),
        } satisfies NavigationTab,
      ]
    : []),
];

type NavigationTab =
  | {
      title: string;
      page: Page;
      icon: React.ReactNode;
      accessRoles?: ("moderator" | "educator" | "admin" | "member")[];
      navigationType: "no-sub-navigation";
      displayComponent: React.ReactNode;
      actionbarComponent?: React.ReactNode;
    }
  | {
      title: string;
      page: Page;
      icon: React.ReactNode;
      accessRoles?: ("moderator" | "educator" | "admin" | "member")[];
      navigationType: "static-sub-navigation";
      subNavigationTabs: SubNavigationElement[];
    }
  | {
      title: string;
      page: Page;
      icon: React.ReactNode;
      accessRoles?: ("moderator" | "educator" | "admin" | "member")[];
      navigationType: "async-sub-navigation";
      skeletonComponent: React.ReactNode;
      getSubNavigationTabs: () => Promise<SubNavigationElement[]>;
    };

export type SubNavigationElement =
  | {
      id: string;
      type: "divider";
      component: React.ReactNode;
    }
  | {
      id: string;
      type: "tab";
      searchValue: string;
      tabComponent: (isActive: boolean) => React.ReactNode;
      displayComponent: React.ReactNode;
      actionbarComponent: React.ReactNode;
    };
