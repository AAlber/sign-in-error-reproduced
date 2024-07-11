import UserDefaultImage from "@/src/components/user-default-image";
import type { InstitutionUserManagementUser } from "@/src/types/user-management.types";
import TruncateHover from "../../truncate-hover";

export const UserHeader = ({
  user,
}: {
  user: InstitutionUserManagementUser;
}) => {
  return (
    <div className="flex w-full -mt-8 pointer-events-none flex-col items-center gap-4 p-4">
      <UserDefaultImage dimensions="w-40 h-40" user={user} />
      <div className="flex flex-col justify-center text-center">
        <TruncateHover
          text={user.name}
          truncateAt={26}
          className="text-lg font-bold text-contrast"
        />
        <TruncateHover
          text={user.email}
          truncateAt={30}
          className="text-sm text-muted-contrast"
        />
      </div>
    </div>
  );
};
