import { memo } from "react";
import { Button } from "../../../reusable/shadcn-ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../reusable/shadcn-ui/popover";
import { AdminDashUserOverview } from "./user-overview";

const UsersPopover = memo(function UsersPopover({
  totalUsers,
  institutionId,
}: {
  totalUsers: number;
  institutionId: string;
}) {
  return (
    <Popover>
      <PopoverTrigger>
        <Button>
          <p className="text-sm text-contrast">{totalUsers}</p>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[600px]">
        <AdminDashUserOverview institutionId={institutionId} />
      </PopoverContent>
    </Popover>
  );
});
export default UsersPopover;
