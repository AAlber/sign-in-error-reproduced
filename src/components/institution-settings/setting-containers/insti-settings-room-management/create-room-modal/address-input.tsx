import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDebounce } from "@/src/client-functions/client-utils/hooks";
import Input from "@/src/components/reusable/input";
import Map from "@/src/components/reusable/map-display";
import { useCreateRoomModal } from "./zustand";

export default function RoomAddressInput({
  showMap = false,
}: {
  showMap?: boolean;
}) {
  const { address, addressNotes, setAddress, setAddressNotes } =
    useCreateRoomModal();
  const [mapAddress, setMapAddress] = useState<string>("");

  useDebounce(() => setMapAddress(address), [address], 500);

  const { t } = useTranslation("page");

  return (
    <div className="flex flex-col gap-2">
      <Input
        text={address}
        setText={setAddress}
        placeholder="Haupstraße 1, 12345 Berlin"
        maxLength={200}
      />
      <Input
        text={addressNotes}
        setText={setAddressNotes}
        placeholder={t(
          "organization_settings.room_management_modal_step3_placeholder",
        )}
        maxLength={500}
      />
      {showMap && address && <Map address={mapAddress} height="200px" />}
    </div>
  );
}
