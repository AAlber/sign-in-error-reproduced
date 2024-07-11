import {
  BarChart3,
  CalendarCheck,
  CreditCard,
  Database,
  FileBadge2,
  Key,
  NotebookTabs,
  Users,
} from "lucide-react";
import useUser from "@/src/zustand/user";
import GradingOverviewTable from "../grading-overview-table";
import MultiPageModal from "../multi-page-modal";
import { useUserOverview } from "../user-overview-sheet/zustand";
import { UserNotesEditor } from "./notes-editor";
import UserAccessTable from "./user-access-table";
import UserAttendanceView from "./user-attendance-view";
import UserDataFieldList from "./user-data-field-list";
import UserEctsExportTable from "./user-ects-export-table";
import UserGroupsTable from "./user-groups-table";
import UserInvoicesTable from "./user-invoices";

export default function UserOverview() {
  const { user: userData } = useUser();
  const { open, user, setOpen } = useUserOverview();

  if (!user) return null;

  return (
    <MultiPageModal
      open={false}
      setOpen={setOpen}
      title={user.name}
      useTabsInsteadOfSteps={true}
      noButtons
      finishButtonText="close"
      onClose={() => setOpen(false)}
      onFinish={() => Promise.resolve()}
      height="md"
      pages={[
        {
          nextStepRequirement: () => true,
          title: user.name,
          tabIcon: <Key size={17} />,
          tabTitle: "access",
          description: "access_description",
          children: <UserAccessTable user={user} />,
        },
        {
          nextStepRequirement: () => true,
          title: user.name,
          tabTitle: "groups",
          tabIcon: <Users size={17} />,
          description: "groups_description",
          children: <UserGroupsTable user={user} />,
        },
        {
          nextStepRequirement: () => true,
          title: user.name,
          tabTitle: "attendance",
          tabIcon: <CalendarCheck size={17} />,
          description: "attendence.user_overview.description",
          children: <UserAttendanceView user={user} />,
        },
        // {
        //   nextStepRequirement: () => true,
        //   title: user.name,
        //   tabTitle: "documents",
        //   tabIcon: <NotebookTabs size={17} />,
        //   description: "user-documents-description",
        //   children: <UserNotesEditor userId={user.id} />,
        // },
        {
          nextStepRequirement: () => true,
          title: user.name,
          tabTitle: "custom_data",
          tabIcon: <Database size={17} />,
          description: "custom_data_description",
          children: <UserDataFieldList user={user} />,
        },
        {
          nextStepRequirement: () => true,
          title: user.name,
          tabTitle: "grades",
          tabIcon: <BarChart3 size={17} />,
          description: "attendence.user_overview.description",
          children: <GradingOverviewTable userId={user.id} />,
        },

        {
          nextStepRequirement: () => true,
          title: user.name,
          tabTitle: "notes",
          tabIcon: <NotebookTabs size={17} />,
          description: "user_notes_description",
          children: <UserNotesEditor userId={user.id} />,
        },

        ...(userData.institution?.institutionSettings.addon_ects_points
          ? [
              {
                nextStepRequirement: () => true,
                title: user.name,
                beta: true,
                tabTitle: "ects",
                tabIcon: <FileBadge2 size={17} />,
                description: "ects_description",
                children: <UserEctsExportTable user={user} />,
              },
            ]
          : []),

        {
          nextStepRequirement: () => true,
          title: user.name,
          tabTitle: "invoices",
          tabIcon: <CreditCard size={17} />,
          description: "account_modal.invoices_subtitle",
          children: <UserInvoicesTable user={user} />,
        },
      ]}
    />
  );
}
