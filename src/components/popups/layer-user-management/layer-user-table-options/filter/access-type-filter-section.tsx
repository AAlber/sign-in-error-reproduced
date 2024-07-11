import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";
import type { AccessLevel } from "@/src/types/user-management.types";
import useUserLayerManagement from "../../zustand";
import FilterSection from "./filter-checkbox-section";

export default function FilterSectionAccessLevel() {
  const { filter, setFilter } = useUserLayerManagement();

  const handleCheckboxChange = (level: AccessLevel, selected: boolean) => {
    setFilter({
      ...filter,
      allowedAccessLevels: [
        ...(selected
          ? [...filter.allowedAccessLevels, level]
          : filter.allowedAccessLevels.filter((l) => l !== level)),
      ],
    });
  };

  return (
    <FilterSection>
      <FilterSection.Header>
        <FilterSection.Title label="access-level" />
        <FilterSection.Description label="access-level.description" />
      </FilterSection.Header>
      <FilterSection.SingleSelectOptions>
        <FilterSection.SingleSelectOption
          icon={<ArrowDown className="h-5 w-5" />}
          label="parent_access"
          description="parent_access_desc"
          selected={filter.allowedAccessLevels.includes("parent-access")}
          onSelect={() =>
            handleCheckboxChange(
              "parent-access",
              !filter.allowedAccessLevels.includes("parent-access"),
            )
          }
        />
        <FilterSection.SingleSelectOption
          icon={<ArrowRight className="h-5 w-5" />}
          label="direct_access"
          description="direct_access_desc"
          selected={filter.allowedAccessLevels.includes("access")}
          onSelect={() =>
            handleCheckboxChange(
              "access",
              !filter.allowedAccessLevels.includes("access"),
            )
          }
        />
        <FilterSection.SingleSelectOption
          icon={<ArrowUp className="h-5 w-6" />}
          label="partial-access"
          description="partial_access_desc"
          selected={filter.allowedAccessLevels.includes("partial-access")}
          onSelect={() =>
            handleCheckboxChange(
              "partial-access",
              !filter.allowedAccessLevels.includes("partial-access"),
            )
          }
        />
      </FilterSection.SingleSelectOptions>
    </FilterSection>
  );
}
