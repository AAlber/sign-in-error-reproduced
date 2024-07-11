import { useTranslation } from "react-i18next";
import { getUsersOfInstitutionAndAvailabilityForTime } from "@/src/client-functions/client-appointment";
import { truncate } from "@/src/client-functions/client-utils";
import AsyncSelect from "@/src/components/reusable/async-select";
import UserDefaultImage from "@/src/components/user-default-image";
import usePlanner from "../../../zustand";
import type { SummaryDataEditorProps } from ".";

export const SummaryOrganizerEditor = (props: SummaryDataEditorProps) => {
  const { t } = useTranslation("page");
  const [draftAppointments, updateDraftAppointment] = usePlanner((state) => [
    state.draftAppointments,
    state.updateDraftAppointment,
  ]);

  return (
    <AsyncSelect
      trigger={props.children as React.ReactElement}
      filter={(item) => !draftAppointments.some((r) => r.id === item.id)}
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
      onSelect={(item) => {
        console.log("item", item);
        updateDraftAppointment(props.id, {
          organizerData: [
            { name: item.name, selectedDataForDisplay: item.name },
          ],
          organizerUsers: [{ organizerId: item.id }],
        });
      }}
    />
  );
};
