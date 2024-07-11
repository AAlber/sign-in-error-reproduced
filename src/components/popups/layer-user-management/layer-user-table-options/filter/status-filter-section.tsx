import type { AccessState } from "@/src/types/user-management.types";
import useUserLayerManagement from "../../zustand";
import FilterSection from "./filter-checkbox-section";

export default function FilterSectionAccessStatus() {
  const { filter, setFilter } = useUserLayerManagement();

  const handleCheckboxChange = (state: AccessState, checked: boolean) => {
    setFilter({
      ...filter,
      allowedAccessStates: checked
        ? [...filter.allowedAccessStates, state]
        : filter.allowedAccessStates.filter((s) => s !== state),
    });
  };

  return (
    <FilterSection>
      <FilterSection.Header>
        <FilterSection.Title label="access-level" />
        <FilterSection.Description label="access-level.description" />
      </FilterSection.Header>
      <FilterSection.CheckBoxGrid>
        <FilterSection.Checkbox
          label="active"
          checked={filter.allowedAccessStates.includes("active")}
          onChange={(checked) => handleCheckboxChange("active", checked)}
        />
        <FilterSection.Checkbox
          label="inactive"
          checked={filter.allowedAccessStates.includes("inactive")}
          onChange={(checked) => handleCheckboxChange("inactive", checked)}
        />
      </FilterSection.CheckBoxGrid>
    </FilterSection>
  );
}
