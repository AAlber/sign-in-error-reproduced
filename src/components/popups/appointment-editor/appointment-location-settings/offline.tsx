import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Label } from "@/src/components/reusable/shadcn-ui/label";
import useUser from "@/src/zustand/user";
import Input from "../../../reusable/input";
import RoomSelector from "../room-selector";
import useAppointmentEditor from "../zustand";

export default function LocationSettingsOfflineEvents() {
  const { user } = useUser();
  const { address, isOnline, setRoomId, setAddress } = useAppointmentEditor();
  const [useCustomAddress, setUseCustomAddress] = useState(false);
  const { t } = useTranslation("page");

  useEffect(() => {
    if (!isOnline && address) setUseCustomAddress(true);
  }, [isOnline]);

  const addOnRoomManagementEnabled =
    user.institution?.institutionSettings.addon_room_management;

  return (
    <>
      <Label>
        {useCustomAddress || !addOnRoomManagementEnabled
          ? t("organization_profile.address_title")
          : t("appointment_modal.location_settings_select_room_placeholder")}
      </Label>
      {!useCustomAddress && addOnRoomManagementEnabled && <RoomSelector />}
      {(!addOnRoomManagementEnabled || useCustomAddress) && (
        <Input
          text={address}
          setText={setAddress}
          placeholder="appointment_modal.location_settings_address_label"
          maxLength={500}
        />
      )}
      {addOnRoomManagementEnabled && (
        <button
          onClick={() => {
            setUseCustomAddress(!useCustomAddress);
            setAddress("");
            setRoomId("");
          }}
          className="col-span-2 ml-auto flex w-[fit-content] justify-end pl-5 text-end text-sm text-muted-contrast underline hover:text-blue-500"
        >
          <span>
            {useCustomAddress
              ? t("appointment_modal.location_settings_select_room_placeholder")
              : t("appointment_modal.location_settings_address_option_address")}
          </span>
        </button>
      )}
    </>
  );
}
