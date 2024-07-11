import type { ColumnDef } from "@tanstack/react-table";
import { UserCog, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { removeAdminRole } from "@/src/client-functions/client-institution-settings";
import confirmAction from "@/src/client-functions/client-options-modal";
import { getAdminsOfInstitution } from "@/src/client-functions/client-user-management";
import AsyncTable from "@/src/components/reusable/async-table";
import { EmptyState } from "@/src/components/reusable/empty-state/empty-state";
import GiveAccessPopover from "@/src/components/reusable/give-access-popover";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { toast } from "@/src/components/reusable/toaster/toast";
import TruncateHover from "@/src/components/reusable/truncate-hover";
import UserDefaultImage from "@/src/components/user-default-image";
import type { UserWithAccess } from "@/src/types/user-management.types";
import useUser from "@/src/zustand/user";
import SettingsSection from "../../../reusable/settings/settings-section";
import PendingAdminInvitesIndicator from "./pending-admin-invites-indicator";
import { useAdminList } from "./zustand";

export default function AdminList() {
  const { user: data } = useUser();
  const { refresh, refreshAdminList, users, setUsers } = useAdminList();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("page");

  const columns: ColumnDef<UserWithAccess>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: t("name"),
      cell: ({ row }) => (
        <div className="flex items-center justify-start gap-4">
          <UserDefaultImage user={row.original} dimensions={"h-6 w-6"} />
          <TruncateHover text={row.original.name} truncateAt={30} />
        </div>
      ),
    },
    {
      id: "status",
      accessorKey: "status",
      header: t("status"),
      cell: ({ row }) => (
        <div className="flex items-center justify-start gap-4">
          {t(row.original.accessState)}
        </div>
      ),
    },
    {
      id: "menu",
      cell: ({ row }) => (
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              event.preventDefault();
              confirmAction(
                () => {
                  if (users.length === 1) {
                    toast.warning(
                      "toast.org_settings_warning_remove_last_admin",
                      {
                        description:
                          "toast.org_settings_warning_remove_last_admin_description",
                        icon: "🤚",
                      },
                    );
                    return;
                  }
                  setUsers(users.filter((u) => u.id !== row.original.id));
                  removeAdminRole(row.original.id);
                },
                {
                  title: "Remove Admin",
                  description: `Confirm removal of ${row.original.name}'s admin status? They'll lose access to all layers and courses but remain an institution member.`,
                  actionName: "Remove",
                  displayComponent: () => (
                    <div
                      key={row.original.id}
                      className="mb-6 flex items-center justify-between rounded-md border border-border px-4 py-3"
                    >
                      <div className="flex items-center">
                        <UserDefaultImage
                          user={row.original}
                          dimensions={"h-8 w-8"}
                        />
                        <div className="ml-4">
                          <div className="text-sm text-contrast">
                            {row.original.name}
                          </div>
                          <div className="text-xs text-muted-contrast">
                            {row.original.email}
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                  dangerousAction: true,
                  requiredConfirmationCode: true,
                },
              );
            }}
          >
            <X className="h-5 w-5 text-muted-contrast" />
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    setLoading(true);
    getAdminsOfInstitution().then((res) => {
      setUsers(res);
      setLoading(false);
    });
  }, [refresh]);

  return (
    <SettingsSection
      title="organization_settings.administrators_list_title"
      subtitle="organization_settings.administrators_list_subtitle"
      noFooter={true}
      footerButtonText=""
      footerButtonDisabled={true}
    >
      <div>
        <PendingAdminInvitesIndicator
          institutionId={data.currentInstitutionId}
        />
        <AsyncTable<UserWithAccess>
          promise={getAdminsOfInstitution}
          columns={columns}
          data={users}
          setData={setUsers}
          refreshTrigger={refresh}
          styleSettings={{
            emptyState: (
              <EmptyState
                icon={UserCog}
                title="admins.empty.title"
                description="admins.empty.description"
              />
            ),
            rowsPerPage: 10,
            additionalComponent: (
              <div className="flex items-center gap-2">
                <GiveAccessPopover
                  data={{
                    onUserInvited: () => refreshAdminList(),
                    onUserAdded: (user) => refreshAdminList(),
                    layerId: data.currentInstitutionId,
                    availableRoles: ["admin"],
                    allowQuickInvite: false,
                    allowGroupImport: false,
                  }}
                >
                  <Button>{t("add_admins")}</Button>
                </GiveAccessPopover>
              </div>
            ),
          }}
        />
      </div>
    </SettingsSection>
  );
}
