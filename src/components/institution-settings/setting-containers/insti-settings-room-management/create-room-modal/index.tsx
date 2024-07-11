import { Hash, MapPin, Settings2 } from "lucide-react";
import createInstiutionRoom, {
  updateInstitutionRoom,
} from "@/src/client-functions/client-institution-room";
import Modal from "@/src/components/reusable/multi-page-modal";
import useUser from "@/src/zustand/user";
import RoomAddressInput from "./address-input";
import RoomNameInput from "./name-input";
import RoomProptertySettings from "./select-capacity";
import { useCreateRoomModal } from "./zustand";

export default function CreateRoomModal() {
  const { user: data } = useUser();
  const {
    editMode,
    roomId,
    open,
    name,
    address,
    addressNotes,
    capacity,
    amenities,
    setOpen,
    reset,
  } = useCreateRoomModal();

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title={
        editMode
          ? "organization_settings.room_management_modal_title_edit"
          : "organization_settings.room_management_modal_title_create"
      }
      finishButtonText={
        editMode
          ? "general.save"
          : "organization_settings.room_management_modal_button_create"
      }
      onFinish={async () => {
        const roomData = {
          name,
          institutionId: data.currentInstitutionId,
          address,
          personCapacity: capacity,
          addressNotes,
          amenities: amenities.join(","),
        };
        if (editMode) updateInstitutionRoom({ id: roomId, ...roomData });
        else createInstiutionRoom(roomData);
        reset();
      }}
      onClose={reset}
      useTabsInsteadOfSteps={editMode}
      height={"lg"}
      pages={[
        {
          nextStepRequirement: () => name.trim().length > 0,
          title: "organization_settings.room_management_modal_step1_title",
          tabIcon: <Hash size={17} />,
          tabTitle:
            "organization_settings.room_management_modal_step1_tab_title",
          description:
            "organization_settings.room_management_modal_step1_subtitle",
          children: <RoomNameInput />,
        },
        {
          title: "organization_settings.room_management_modal_step2_title",
          tabIcon: <Settings2 size={17} />,
          tabTitle:
            "organization_settings.room_management_modal_step2_tab_title",
          description:
            "organization_settings.room_management_modal_step2_subtitle",
          nextStepRequirement: () => true,
          children: <RoomProptertySettings />,
        },
        {
          title: "organization_settings.room_management_modal_step3_title",
          tabIcon: <MapPin size={17} />,
          tabTitle:
            "organization_settings.room_management_modal_step3_tab_title",
          description:
            "organization_settings.room_management_modal_step3_subtitle",
          nextStepRequirement: () => address.trim().length > 0,
          children: <RoomAddressInput showMap />,
        },
      ]}
    />
  );
}
