import type { InstitutionUserManagementUser } from "@/src/types/user-management.types";
import { log } from "@/src/utils/logger/logger";
import { useUserOverview } from "./zustand";

export const UserOverviewTrigger = ({
  user,
  children,
}: {
  user: InstitutionUserManagementUser;
  children: React.ReactNode;
}) => {
  const { init } = useUserOverview();
  const handleUserClick = () => {
    log.context("user", {
      userId: user.id,
      userName: user.name,
    });
    init(user);
    log.info("Opened user overview modal");
  };
  return <div onClick={handleUserClick}>{children}</div>;
};
