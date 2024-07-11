import { memo } from "react";
import { AdminDashInviteOverview } from "../popovers/invitation-popover/invite-overview";
import { AdminDashUserOverview } from "../popovers/user-overview";
import { useAdminDash } from "../zustand";

const InstitutionOverviewCenter = memo(function InstitutionOverviewCenter() {
  const { openedAdminDashInstitution } = useAdminDash();
  const institution = openedAdminDashInstitution?.institution;
  return (
    institution && (
      <div className="flex w-[800px] flex-col gap-12 px-8">
        <div className="mt-4 w-full">
          <div className="text-xl font-semibold">Users</div>
          <div className="flex size-full flex-col gap-4 rounded-md bg-foreground">
            <AdminDashUserOverview institutionId={institution.id} />
          </div>
        </div>
        <div className="mt-4 w-full">
          <div className="flex size-full flex-col gap-4 rounded-md bg-foreground">
            <AdminDashInviteOverview
              invitations={institution.invite}
              adminDashInstitution={openedAdminDashInstitution}
            />
          </div>
        </div>
      </div>
    )
  );
});
export default InstitutionOverviewCenter;
