import { Plus, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getInstitutionRooms } from "@/src/client-functions/client-institution-room";
import classNames, { truncate } from "@/src/client-functions/client-utils";
import useUser from "@/src/zustand/user";
import AsyncSelect from "../../../reusable/async-select";
import { Button } from "../../../reusable/shadcn-ui/button";
import WithToolTip from "../../../reusable/with-tooltip";
import usePlanner from "../zustand";
import SelectionWrapper from "./wrapper";

export default function RoomSelection() {
  const { t } = useTranslation("page");
  const { rooms, setRooms } = usePlanner();
  const { user } = useUser();

  return (
    <SelectionWrapper
      title={t("planner.selection.rooms")}
      description={t("planner.selection.rooms.description")}
    >
      {rooms.map((room) => (
        <WithToolTip text={"general.remove"} key={room.id}>
          <Button
            className="flex items-center gap-4 font-normal"
            onClick={() => setRooms(rooms.filter((r) => r.id !== room.id))}
          >
            {room.name}
            <span className="flex items-center font-normal text-muted-contrast">
              <User className="mr-1 h-3.5 w-3.5" />
              {room.personCapacity}
            </span>
          </Button>
        </WithToolTip>
      ))}
      <AsyncSelect
        trigger={
          <Button
            variant={"ghost"}
            className={classNames(
              "flex items-center gap-2 font-normal",
              rooms.length === 0 && "-ml-0.5 pl-1 text-primary",
            )}
          >
            <Plus className="mr-1 h-4 w-4" />
            {rooms.length === 0 && t("planner.add_room")}
          </Button>
        }
        filter={(item) => !rooms.some((r) => r.id === item.id)}
        fetchData={async () =>
          getInstitutionRooms(user.currentInstitutionId, "")
        }
        placeholder="general.search"
        noDataMessage="general.empty"
        searchValue={(item) => item.name + " " + item.id}
        itemComponent={(item) => <span> {truncate(item.name ?? "", 30)}</span>}
        onSelect={(item) => setRooms([...rooms, item])}
      />
    </SelectionWrapper>
  );
}
