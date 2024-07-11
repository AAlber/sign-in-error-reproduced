import { Edit } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DropdownMenuItem } from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import { useCreateRoomModal } from "../../create-room-modal/zustand";

export default function RoomEdit({ room }: { room: any }) {
  const { openSettingsForRoom } = useCreateRoomModal();
  const { t } = useTranslation("page");

  return (
    <DropdownMenuItem onClick={() => openSettingsForRoom(room)}>
      <Edit className="h-4 w-4 text-contrast" />
      <span className="text-sm text-contrast">
        {t("organization_settings.room_management_table_dropdown_edit")}
      </span>
    </DropdownMenuItem>
  );
}
