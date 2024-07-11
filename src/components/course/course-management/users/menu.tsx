import { MoreHorizontal } from "lucide-react";
import { removeRole } from "@/src/client-functions/client-user-management";
import useOpenChatWithUser from "@/src/components/reusable/page-layout/navigator/chat/hooks/useOpenChatWithUser";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import useCourseManagement from "../zustand";

export default function CourseManagementUserMenu({
  layerId,
  user,
}: {
  layerId: string;
  user: CourseMember;
}) {
  const { openChatWithUser } = useOpenChatWithUser();
  const { users, setUsers } = useCourseManagement();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MoreHorizontal
          aria-hidden="true"
          className="h-5 w-5 text-muted-contrast hover:opacity-60"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => openChatWithUser(user.id, user.name)}>
          Chat
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive"
          onClick={async () => {
            setUsers(users.filter((u) => u.id !== user.id));
            const success = await removeRole({ userId: user.id, layerId });
            if (!success) return setUsers(users);
          }}
        >
          Remove
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
