import { Trash } from "lucide-react";
import { useTranslation } from "react-i18next";
import { deleteInstitutionRoom } from "@/src/client-functions/client-institution-room";
import confirmAction from "@/src/client-functions/client-options-modal";
import { DropdownMenuItem } from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import { useInstitutionRoomList } from "../../zustand";

export default function RoomRemoveFromInstitution({ id }: { id: string }) {
  const { rooms, setRooms } = useInstitutionRoomList();
  const { t } = useTranslation("page");

  return (
    <DropdownMenuItem
      onClick={() =>
        confirmAction(
          () => {
            setRooms(rooms.filter((room) => room.id !== id));
            deleteInstitutionRoom(id);
          },
          {
            title:
              t("general.delete") + rooms.find((room) => room.id === id)?.name,
            description:
              "organization_settings.confirm_action_delete_room_description",
            actionName: "general.delete",
            dangerousAction: true,
          },
        )
      }
    >
      <Trash className="h-4 w-4 text-destructive" />
      <span className="text-sm text-destructive">
        {t("organization_settings.room_management_table_dropdown_remove")}
      </span>
    </DropdownMenuItem>
  );
}
