import { MoreHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { MemberWithAttendence } from "@/src/client-functions/client-appointment-attendence";
import useOpenChatWithUser from "@/src/components/reusable/page-layout/navigator/chat/hooks/useOpenChatWithUser";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/reusable/shadcn-ui/dropdown-menu";

type UserAttendenceMenuProps = {
  member: MemberWithAttendence;
  onAttendenceChange: (updatedMember: MemberWithAttendence) => void;
};

export default function UserAttendenceMenu({
  member,
  onAttendenceChange,
}: UserAttendenceMenuProps) {
  const { openChatWithUser } = useOpenChatWithUser();
  const { t } = useTranslation("page");

  const handleAttendenceChange = (newValue: string) => {
    const updatedMember = { ...member };
    if (newValue === "attended") {
      updatedMember.attended = true;
    } else if (newValue === "not-attended") {
      updatedMember.attended = false;
    }

    onAttendenceChange(updatedMember);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MoreHorizontal
          aria-hidden="true"
          className="h-5 w-5 text-muted-contrast hover:opacity-60"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => {
            openChatWithUser(member.id, member.name);
          }}
        >
          Chat
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={member.attended ? "attended" : "not-attended"}
          onValueChange={(newValue) => handleAttendenceChange(newValue)}
        >
          <DropdownMenuRadioItem value="attended">
            {t("attendence.attended")}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="not-attended">
            {t("attendence.not_attended")}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
