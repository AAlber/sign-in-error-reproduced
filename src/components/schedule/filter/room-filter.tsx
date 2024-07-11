import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getInstitutionRooms } from "@/src/client-functions/client-institution-room";
import useUser from "@/src/zustand/user";
import type { Room } from "../../institution-settings/setting-containers/insti-settings-room-management/data-table/columns";
import AsyncSelect from "../../reusable/async-select";
import { Button } from "../../reusable/shadcn-ui/button";
import useSchedule from "../zustand";
import useScheduleFilter from "../zustand-filter";

export const RoomFilter = () => {
  const { user: data } = useUser();
  const { t } = useTranslation("page");
  const { refreshAppointments } = useSchedule();
  const { setFilteredLayers, setFilteredRoom, filteredRoom } =
    useScheduleFilter();

  const handleSelect = (room: Room) => {
    if (!room) return;
    setFilteredLayers([]);
    if (filteredRoom?.id === room.id) {
      setFilteredRoom(undefined);
    } else {
      setFilteredRoom(room);
    }
    refreshAppointments();
  };

  if (!data.institution?.institutionSettings.addon_room_management) return null;

  return (
    <AsyncSelect
      side="bottom"
      trigger={
        <Button className="min-w-[150px]">
          {t(filteredRoom ? filteredRoom.name : "select_room")}
        </Button>
      }
      placeholder="appointment_modal.location_settings_select_room_placeholder"
      fetchData={async () =>
        await getInstitutionRooms(data.currentInstitutionId, "")
      }
      onSelect={handleSelect}
      searchValue={(item) => item.name + item.id}
      itemComponent={(item) => (
        <>
          {item.name}
          {item.id === filteredRoom?.id && <Check className="h-4 w-4" />}
        </>
      )}
    />
  );
};
