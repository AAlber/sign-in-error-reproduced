import type { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { getUsersOfLayer } from "@/src/client-functions/client-user";
import AccessGate from "@/src/components/reusable/access-gate";
import AsyncTable from "@/src/components/reusable/async-table";
import SettingsSection from "@/src/components/reusable/settings/settings-section";
import UserDefaultImage from "@/src/components/user-default-image";
import type { UserData } from "@/src/types/user-data.types";
import useCourseManagement from "../zustand";
import { AddEducators } from "./add-educators";

const CourseEducatorsTable = ({ layerId }: { layerId: string }) => {
  const { t } = useTranslation("page");
  const { refresh } = useCourseManagement();

  const columns: ColumnDef<UserData>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: t("name"),
      cell: ({ row }) => (
        <div className="flex items-center justify-start gap-4">
          <UserDefaultImage user={row.original} dimensions={"h-6 w-6"} />
          {row.original.name}
        </div>
      ),
    },
    {
      id: "email",
      accessorKey: "email",
      header: t("email"),
      cell: ({ row }) => (
        <div className="flex items-center justify-start gap-4">
          {row.original.email}
        </div>
      ),
    },
  ];

  return (
    <SettingsSection
      title="course_management.educators.title"
      subtitle="course_management.educators.description"
      noFooter
      bigContent
    >
      <AsyncTable<UserData>
        columns={columns}
        promise={() =>
          getUsersOfLayer({
            layerId: layerId,
            role: "educator",
          }) as unknown as Promise<UserData[]>
        }
        styleSettings={{
          additionalComponent: (
            <AccessGate
              rolesWithAccess={["admin", "moderator"]}
              layerId={layerId}
            >
              <AddEducators layerId={layerId} />
            </AccessGate>
          ),
        }}
        refreshTrigger={refresh}
      />
    </SettingsSection>
  );
};

export default CourseEducatorsTable;
