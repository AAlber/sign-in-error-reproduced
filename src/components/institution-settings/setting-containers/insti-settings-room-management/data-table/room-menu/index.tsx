import { Calendar, MoreHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";
import useRoomDialog from "@/src/components/reusable/room-schedule/zustand";
import { Dialog } from "@/src/components/reusable/shadcn-ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import RoomEdit from "./edit";
import RoomRemoveFromInstitution from "./remove";

export default function RoomMenu({ room }: { room: any }) {
  const { t } = useTranslation("page");
  const { init } = useRoomDialog();

  return (
    <Dialog modal={false}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <MoreHorizontal
            className="text-muted-contrast hover:opacity-70"
            size={18}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <RoomEdit room={room} />

            <DropdownMenuItem onClick={() => init({ room, date: new Date() })}>
              <Calendar className="h-4 w-4 text-contrast" />
              <span className="text-sm text-contrast">
                {t("view_schedule")}
              </span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <RoomRemoveFromInstitution id={room.id} />
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </Dialog>
  );
}
