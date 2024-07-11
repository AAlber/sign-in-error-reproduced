import type { ColumnDef } from "@tanstack/react-table";
import { UserRoundX } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getCourseMembersWithRoleAndAccomplishments } from "@/src/client-functions/client-course";
import { truncate } from "@/src/client-functions/client-utils";
import ExportCsvButton from "@/src/components/reusable/csv-export-button/export-button";
import { EmptyState } from "@/src/components/reusable/empty-state";
import GiveAccessPopover from "@/src/components/reusable/give-access-popover";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import AsyncTable from "../../../reusable/async-table";
import SettingsSection from "../../../reusable/settings/settings-section";
import WithToolTip from "../../../reusable/with-tooltip";
import UserDefaultImage from "../../../user-default-image";
import useCourseManagement from "../zustand";
import AttendenceDisplay from "./attendence-overview";
import BlockGoalsOverview from "./goal-block-overview";
import PassedStatusCheckbox from "./passed-status-checkbox";
import getCourseUserDataForExport from "./user-data-export";

export default function CourseUsersTable({ layerId }: { layerId: string }) {
  const { t } = useTranslation("page");
  const { users, setUsers, refresh, setRefresh } = useCourseManagement();

  const columns: ColumnDef<CourseMember>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: t("name"),
      cell: ({ row }) => (
        <div className="flex items-center justify-start gap-4">
          <UserDefaultImage user={row.original} dimensions={"h-6 w-6"} />
          {truncate(row.original.name, 30)}
        </div>
      ),
    },
    {
      id: "attendance",
      accessorKey: "attendance",
      header: () => (
        <div className="flex items-center gap-2">
          {t("attendance")}
          <WithToolTip text="course_management.goals.attendence.help" />
        </div>
      ),
      cell: ({ row }) => <AttendenceDisplay courseMember={row.original} />,
    },
    {
      id: "blockgoals",
      accessorKey: "blockgoals",
      header: () => (
        <div className="flex w-auto items-center gap-2">
          {t("course_management.goals.prerequisites")}
          <WithToolTip text="course_management.goals.prerequisites.help" />
        </div>
      ),
      cell: ({ row }) => <BlockGoalsOverview courseMember={row.original} />,
    },
    {
      id: "status",
      accessorKey: "status",
      header: () => (
        <div className="flex items-center gap-2">
          {t("status")}
          <WithToolTip text="course_management.users.status.help" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="mr-2 flex w-3 items-center ">
          <PassedStatusCheckbox courseMember={row.original} />
        </div>
      ),
    },
  ];

  return (
    <SettingsSection
      title="course_management.users"
      subtitle="course_management.users.description"
      noFooter
      bigContent
    >
      <AsyncTable<CourseMember>
        promise={() => getCourseMembersWithRoleAndAccomplishments(layerId)}
        columns={columns}
        data={users}
        setData={setUsers}
        refreshTrigger={refresh}
        styleSettings={{
          emptyState: (
            <EmptyState
              icon={UserRoundX}
              title="course.users.empty.title"
              description="course.users.empty.description"
            >
              <EmptyState.Article articleId={9182567} />
            </EmptyState>
          ),
          rowsPerPage: 10,
          additionalComponent: (
            <div className="flex items-center gap-2">
              <ExportCsvButton
                data={users.map((u) => getCourseUserDataForExport(u, t))}
                fileBaseName="course-users"
              />
              <GiveAccessPopover
                data={{
                  layerId,
                  allowGroupImport: true,
                  allowQuickInvite: true,
                  availableRoles: ["member"],
                  onUserInvited: () => setRefresh(refresh + 1),
                  onUserAdded: () => {
                    setRefresh(refresh + 1);
                  },
                }}
              >
                <Button> {t("add_users")}</Button>
              </GiveAccessPopover>
            </div>
          ),
        }}
      />
    </SettingsSection>
  );
}
