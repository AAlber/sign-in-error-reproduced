import type { ColumnDef } from "@tanstack/react-table";
import { Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getUserGroupsOfInstitution } from "@/src/client-functions/client-institution-user-groups";
import AsyncTable from "@/src/components/reusable/async-table";
import { EmptyState } from "@/src/components/reusable/empty-state/empty-state";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import TableHeaderElement from "@/src/components/reusable/table-header";
import SettingsSection from "../../../reusable/settings/settings-section";
import GroupMenu from "./group-menu";
import { useUserGroupModal } from "./group-modal/zustand";
import { useInstitutionGroupList } from "./zustand";

export type UserGroup = {
  id: string;
  name: string;
  members: number;
  additionalInformation: string;
};

export default function UserManagementGroups() {
  const { groups, setGroups } = useInstitutionGroupList();
  const openGroupCreation = useUserGroupModal(
    (state) => state.openGroupCreation,
  );

  const { t } = useTranslation("page");

  const columns: ColumnDef<UserGroup>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: ({ table }) => {
        return (
          <TableHeaderElement
            text="organization_settings.user_management_table_header_name"
            onClick={() => table.toggleAllRowsExpanded()}
            className="cursor-pointer"
          />
        );
      },
      cell: ({ row }) => {
        return <span className="ml-[s]">{row.getValue("name")}</span>;
      },
    },
    {
      accessorKey: "members",
      header: ({ table }) => {
        return (
          <div className="">
            <TableHeaderElement
              text="organization_settings.user_management_table_header_members"
              onClick={() => table.toggleAllRowsExpanded()}
              className="cursor-pointer"
            />
          </div>
        );
      },
      cell: ({ row }) => {
        return <span className="ml-[s]">{row.getValue("members")}</span>;
      },
    },
    {
      accessorKey: "additionalInformation",
      header: ({ table }) => {
        return <div>{t("info")}</div>;
      },
      cell: ({ row }) => {
        return (
          <span className="ml-[s]">
            {row.getValue("additionalInformation")}
          </span>
        );
      },
    },
    {
      accessorKey: "menu",
      header: "",
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-end pr-1">
            <GroupMenu group={row.original} />
          </div>
        );
      },
    },
  ];

  return (
    <SettingsSection
      title="organization_settings.user_management_title"
      subtitle="organization_settings.user_management_subtitle"
      noFooter={true}
      footerButtonText=""
      footerButtonDisabled={true}
      footerButtonAction={async () => console.log("")}
    >
      <AsyncTable<UserGroup>
        columns={columns}
        promise={() => getUserGroupsOfInstitution("")}
        data={groups}
        setData={setGroups}
        styleSettings={{
          emptyState: (
            <EmptyState
              icon={Users}
              title="user.groups.empty.title"
              description="user.groups.empty.description"
            >
              <EmptyState.Article articleId={9184766} />
            </EmptyState>
          ),
          additionalComponent: (
            <Button onClick={openGroupCreation}>{t("general.create")}</Button>
          ),
        }}
      />
    </SettingsSection>
  );
}
