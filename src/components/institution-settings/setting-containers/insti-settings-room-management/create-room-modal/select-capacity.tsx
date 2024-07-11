import { User } from "lucide-react";
import { useTranslation } from "react-i18next";
import Box from "@/src/components/reusable/box";
import { Slider } from "@/src/components/reusable/shadcn-ui/slider";
import TagSelector from "@/src/components/reusable/tag-selector";
import { amenities as amenitiesTags } from "@/src/utils/room-amenities";
import { useCreateRoomModal } from "./zustand";

export default function RoomProptertySettings() {
  const { capacity, amenities, setCapacity, setAmenities } =
    useCreateRoomModal();

  const { t } = useTranslation("page");

  return (
    <div className="flex flex-col gap-2">
      <Box>
        <div className="flex flex-col">
          <span className="font-medium text-contrast">
            {t("organization_settings.room_management_modal_step2_capacity")}
          </span>
          <span className="text-sm text-muted-contrast">
            {t(
              "organization_settings.room_management_modal_step2_capacity_text",
            )}
          </span>
        </div>
        <div className="mt-2 flex w-full select-none items-center gap-4">
          <label className="flex w-14 items-center gap-2 font-medium text-contrast">
            <User size={24} />
            <p className="w-10"> {capacity === 100 ? "99+" : capacity} </p>
          </label>
          <div className="relative flex-1">
            <Slider
              onValueChange={(value) => setCapacity(value[0] as number)}
              defaultValue={[capacity]}
              min={5}
              max={100}
              step={1}
            />
          </div>
        </div>
      </Box>
      <TagSelector
        title="organization_settings.room_management_modal_step2_amenities"
        description="organization_settings.room_management_modal_step2_amenities_text"
        availableTags={amenitiesTags}
        selectedTags={amenities}
        onChange={setAmenities}
        tagName="organization_settings.room_management_modal_step2_amenities"
      />
    </div>
  );
}
