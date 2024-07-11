import type { Invite } from "@prisma/client";
import { memo } from "react";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/reusable/shadcn-ui/popover";
import { AdminDashInviteOverview } from "./invite-overview";

const InvitationPopover = memo(function InvitationPopover({
  invitations,
}: {
  invitations: Invite[];
}) {
  return (
    <Popover>
      <PopoverTrigger>
        <Button>
          <p className="text-sm text-contrast">{invitations.length}</p>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px]">
        <AdminDashInviteOverview invitations={invitations} />
      </PopoverContent>
    </Popover>
  );
});

export default InvitationPopover;
