import type { InstitutionUserManagementUser } from "@/src/types/user-management.types";
import useUserOverview from "./zustand";

type UserOverviewTriggerProps = {
  user: InstitutionUserManagementUser;
  children: React.ReactNode;
};

export default function UserOverviewTrigger({
  user,
  children,
}: UserOverviewTriggerProps) {
  const { init } = useUserOverview();

  return (
    <div className="cursor-pointer" onClick={() => init(user)}>
      {children}
    </div>
  );
}
