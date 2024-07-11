import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getInstitutionUserDataFields } from "@/src/client-functions/client-institution-user-data-field";
import AsyncSelect from "@/src/components/reusable/async-select";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import type { InstitutionUserDataFieldWithValueData } from "@/src/types/institution-user-data-field.types";
import { useInstitutionSettings } from "../../zustand";

export default function OrganizerInfoSelect({
  onChange,
}: {
  onChange: () => void;
}) {
  const { t } = useTranslation("page");
  const { institutionSettings, updateInstitutionSettings } =
    useInstitutionSettings();

  return (
    <AsyncSelect<InstitutionUserDataFieldWithValueData>
      trigger={
        <Button className="mt-2 flex w-full items-center justify-between capitalize">
          {institutionSettings.appointment_organizer_display.name}
          <ChevronDown className="h-4 w-4" />
        </Button>
      }
      openWithShortcut={false}
      placeholder="general.search"
      noDataMessage="general.no_results"
      side="bottom"
      fetchData={async () => {
        const customFields = await getInstitutionUserDataFields();
        const standardFields: InstitutionUserDataFieldWithValueData[] = [
          {
            id: "name",
            name: "Name",
            institutionId: "temp",
            valueCount: 0,
            collectFromUser: false,
            showOnStudentIDCard: false,
          },
          {
            id: "email",
            name: "Email",
            institutionId: "temp",
            valueCount: 0,
            collectFromUser: false,
            showOnStudentIDCard: false,
          },
        ];
        return [...standardFields, ...customFields];
      }}
      onSelect={(field) => {
        updateInstitutionSettings({
          appointment_organizer_display: field,
        });
        onChange();
      }}
      searchValue={(field) => field.name + " " + field.id}
      itemComponent={(field) => <>{field.name}</>}
    />
  );
}
