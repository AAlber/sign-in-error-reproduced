import useUser from "@/src/zustand/user";
import UserDocumentsTable from "../../user-overview/user-documents/table";
import Calendar from "./calendar";
import UserOverviewTable from "./overview";
import UserAttendanceView from "./user-overview-tables/user-attendance";
import UserEctsExportTable from "./user-overview-tables/user-ects-export-table";
import { UserGradesTable } from "./user-overview-tables/user-grades";
import UserInvoicesTable from "./user-overview-tables/user-invoices";

export type UserOverviewTab = {
  id: string;
  name: string;
  component: JSX.Element;
  description: string;
  visibleOn: { min: number; max: number }[];
};

export const createTabsList: () => UserOverviewTab[] = () => {
  const { user: userData } = useUser.getState();
  return [
    {
      id: "overview",
      name: "overview",
      component: <UserOverviewTable />,
      description: "overview_description",
      visibleOn: [{ min: 0, max: Infinity }],
    },
    {
      id: "documents",
      name: "documents",
      description: "user-documents-description",
      component: <UserDocumentsTable />,
      visibleOn: [{ min: 0, max: Infinity }],
    },
    {
      id: "calendar",
      name: "CALENDAR",
      component: <Calendar />,
      description: "user_overview.calendar.description",
      visibleOn: [{ min: 0, max: Infinity }],
    },
    {
      id: "grades",
      name: "grades",
      component: <UserGradesTable />,
      description: "attendence.user_overview.description",
      visibleOn: [
        {
          min: userData.institution?.institutionSettings.addon_ects_points
            ? 800
            : 1075,
          max: Infinity,
        },
      ],
    },
    ...(userData.institution?.institutionSettings.addon_ects_points
      ? [
          {
            id: "ects",
            name: "ects",
            component: <UserEctsExportTable />,
            description: "ects_description",
            visibleOn: [{ min: 1075, max: Infinity }],
          },
        ]
      : []),
    {
      id: "attendance",
      name: "attendance",
      component: <UserAttendanceView />,
      description: "attendence.user_overview.description",
      visibleOn: [
        {
          min: 1200,
          max: Infinity,
        },
      ],
    },
    {
      id: "invoices",
      name: "invoices",
      component: <UserInvoicesTable />,
      description: "account_modal.invoices_subtitle",
      visibleOn: [{ min: 1400, max: Infinity }],
    },
  ];
};
