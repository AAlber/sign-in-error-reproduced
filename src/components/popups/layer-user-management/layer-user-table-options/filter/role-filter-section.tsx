import useUserLayerManagement from "../../zustand";
import FilterSection from "./filter-checkbox-section";

export default function FilterSectionRole() {
  const { filter, setFilter } = useUserLayerManagement();

  const handleCheckboxChange = (
    role: Exclude<Role, "admin">,
    checked: boolean,
  ) => {
    setFilter({
      ...filter,
      allowedRoles: checked
        ? [...filter.allowedRoles, role]
        : filter.allowedRoles.filter((r) => r !== role),
    });
  };

  return (
    <FilterSection>
      <FilterSection.Header>
        <FilterSection.Title label="role" />
        <FilterSection.Description label="filter_role" />
      </FilterSection.Header>
      <FilterSection.CheckBoxGrid>
        <FilterSection.Checkbox
          label="moderator"
          checked={filter.allowedRoles.includes("moderator")}
          onChange={(checked) => handleCheckboxChange("moderator", checked)}
        />
        <FilterSection.Checkbox
          label="educator"
          checked={filter.allowedRoles.includes("educator")}
          onChange={(checked) => handleCheckboxChange("educator", checked)}
        />
        <FilterSection.Checkbox
          label="member"
          checked={filter.allowedRoles.includes("member")}
          onChange={(checked) => handleCheckboxChange("member", checked)}
        />
      </FilterSection.CheckBoxGrid>
    </FilterSection>
  );
}
