import { useEffect, useState } from "react";
import { getInstitutionRooms } from "@/src/client-functions/client-institution-room";
import Skeleton from "@/src/components/skeleton";
import useUser from "@/src/zustand/user";
import SettingsSection from "../../../reusable/settings/settings-section";
import { DataTable } from "./data-table";
import { useInstitutionRoomList } from "./zustand";

export default function RoomManagement() {
  const { user: data } = useUser();
  const { setRooms } = useInstitutionRoomList();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!data) return;
    setLoading(true);
    getInstitutionRooms(data.currentInstitutionId, "").then((res) => {
      setRooms(res);
      setLoading(false);
    });
  }, [data]);

  return (
    <SettingsSection
      title="organization_settings.room_management_title"
      subtitle="organization_settings.room_management_subtitle"
      noFooter={true}
      footerButtonText=""
      footerButtonDisabled={true}
      footerButtonAction={async () => console.log("")}
    >
      <div className="h-full">
        {!loading && <DataTable />}
        {loading && (
          <div className="h-80 w-full overflow-hidden rounded-lg border border-border">
            <Skeleton />
          </div>
        )}
      </div>
    </SettingsSection>
  );
}
