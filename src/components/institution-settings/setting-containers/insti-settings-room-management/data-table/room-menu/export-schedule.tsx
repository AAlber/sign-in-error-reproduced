import { Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { downloadWeekRoomPlan } from "@/src/client-functions/client-institution-room";
import {
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/src/components/reusable/shadcn-ui/dropdown-menu";

export default function RoomDownloadSchedule({ room }: { room: any }) {
  const { t } = useTranslation("page");

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <Calendar className="mr-3 h-4 w-4 text-contrast" />
        <span className="text-sm text-contrast">
          {t(
            "organization_settings.room_management_table_dropdown_export_schedule",
          )}
        </span>
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="mr-3">
        <DropdownMenuItem
          onClick={() => downloadWeekRoomPlan(room.id, "this week")}
        >
          {t(
            "organization_settings.room_management_table_dropdown_export_schedule_week",
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => downloadWeekRoomPlan(room.id, "this month")}
        >
          {t(
            "organization_settings.room_management_table_dropdown_export_schedule_month",
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => downloadWeekRoomPlan(room.id, "this year")}
        >
          {t(
            "organization_settings.room_management_table_dropdown_export_schedule_year",
          )}
        </DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}
