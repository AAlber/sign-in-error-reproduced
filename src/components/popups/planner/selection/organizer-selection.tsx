import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getUsersOfInstitutionAndAvailabilityForTime } from "@/src/client-functions/client-appointment";
import classNames, { truncate } from "@/src/client-functions/client-utils";
import AsyncSelect from "../../../reusable/async-select";
import { Button } from "../../../reusable/shadcn-ui/button";
import WithToolTip from "../../../reusable/with-tooltip";
import UserDefaultImage from "../../../user-default-image";
import usePlanner from "../zustand";
import SelectionWrapper from "./wrapper";

export default function OrganizerSelection() {
  const { t } = useTranslation("page");
  const { organizers, setOrganizers } = usePlanner();
  return (
    <SelectionWrapper
      title={t("planner.organizers.title")}
      description={t("planner.organizers.description")}
    >
      {organizers.map((u) => (
        <WithToolTip text={"general.remove"} key={u.id}>
          <Button
            className="flex items-center gap-2 font-normal"
            onClick={() =>
              setOrganizers(organizers.filter((r) => r.id !== u.id))
            }
          >
            <UserDefaultImage dimensions="w-4 h-4" user={u} />
            {u.name}
          </Button>
        </WithToolTip>
      ))}
      <AsyncSelect
        trigger={
          <Button
            variant={"ghost"}
            className={classNames(
              "flex items-center gap-2 font-normal",
              organizers.length === 0 && "-ml-0.5 pl-1 text-primary",
            )}
          >
            <Plus className="mr-1 h-4 w-4" />
            {organizers.length === 0 && t("planner.add_organizer")}
          </Button>
        }
        filter={(item) => !organizers.some((r) => r.id === item.id)}
        fetchData={async () =>
          getUsersOfInstitutionAndAvailabilityForTime(new Date(), "10")
        }
        placeholder="general.search"
        noDataMessage="general.empty"
        searchValue={(item) => item.name + " " + item.id}
        itemComponent={(item) => (
          <span className="flex items-center gap-2">
            {" "}
            <UserDefaultImage dimensions="w-5 h-5" user={item} />
            {truncate(item.name ?? "", 30)}
          </span>
        )}
        onSelect={(item) => setOrganizers([...organizers, item])}
      />
    </SelectionWrapper>
  );
}
