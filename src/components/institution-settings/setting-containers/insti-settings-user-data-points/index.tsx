import type { ColumnDef } from "@tanstack/react-table";
import { Database } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getInstitutionUserDataFields } from "@/src/client-functions/client-institution-user-data-field";
import AsyncTable from "@/src/components/reusable/async-table";
import { EmptyState } from "@/src/components/reusable/empty-state/empty-state";
import Spinner from "@/src/components/spinner";
import type { InstitutionUserDataFieldWithValueData } from "@/src/types/institution-user-data-field.types";
import SettingsSection from "../../../reusable/settings/settings-section";
import AddUserDataField from "./add-user-data-field";
import { UserDataCollectCheck } from "./user-data-check-collect";
import { UserDataShowInIDCheck } from "./user-data-check-show-in-id";
import UserDataFieldMenu from "./user-data-field-menu";
import { useInstitutionUserDataFieldsList } from "./zustand";

export default function UserManagementDataFields() {
  const { userDataFields, setUserDataFields, loading } =
    useInstitutionUserDataFieldsList();
  const { t } = useTranslation("page");

  const columns: ColumnDef<InstitutionUserDataFieldWithValueData>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: () => {
        return <div>{t("name")}</div>;
      },
      cell: ({ row }) => {
        return <span>{row.original.name}</span>;
      },
    },
    {
      id: "count",
      accessorKey: "count",
      header: () => {
        return <div>{t("data_value_count")}</div>;
      },
      cell: ({ row }) => {
        return <span>{row.original.valueCount}</span>;
      },
    },
    {
      id: "collect-from-user",
      accessorKey: "collectFromUser",
      header: () => {
        return <div>{t("user_data_points_table.collect_from_user")}</div>;
      },
      cell: ({ row }) => {
        if (loading) return <Spinner />;

        return <UserDataCollectCheck row={row} />;
      },
    },
    {
      id: "show-in-user-id",
      accessorKey: "showInUserId",
      header: () => {
        return <div>{t("user_data_points_table.show_in_user_id")}</div>;
      },
      cell: ({ row }) => {
        if (loading) return <Spinner />;

        return <UserDataShowInIDCheck row={row} />;
      },
    },
    {
      accessorKey: "menu",
      header: "",
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-end pr-1">
            <UserDataFieldMenu dataField={row.original} />
          </div>
        );
      },
    },
  ];

  return (
    <SettingsSection
      title="organization_settings.user_management_data_points"
      subtitle="organization_settings.user_management_data_points_subtitle"
      noFooter={true}
      footerButtonText=""
      footerButtonDisabled={true}
      footerButtonAction={async () => console.log("")}
    >
      <AsyncTable
        columns={columns}
        promise={getInstitutionUserDataFields}
        data={userDataFields}
        setData={setUserDataFields}
        styleSettings={{
          emptyState: (
            <EmptyState
              icon={Database}
              title="data.field.empty.title"
              description="data.field.empty.description"
            >
              <EmptyState.Article articleId={8684060} />
            </EmptyState>
          ),
          additionalComponent: <AddUserDataField />,
        }}
        refreshTrigger={loading}
      />
    </SettingsSection>
  );
}
