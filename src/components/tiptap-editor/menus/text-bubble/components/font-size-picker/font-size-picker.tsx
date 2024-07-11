import { useTranslation } from "react-i18next";
import SelectionMenu from "../../../../selection-menu";

interface Props {
  onChange: (value: string) => void;
  currentValue: string;
}

const FONT_SIZES = [
  {
    label: "editor.text-smaller",
    value: "12px",
  },
  { label: "editor.text-small", value: "14px" },
  { label: "editor.text-medium", value: "" },
  { label: "editor.text-large", value: "18px" },
  {
    label: "editor.text-extra-large",
    value: "24px",
  },
];

export const FontSizePicker = ({ currentValue, onChange }: Props) => {
  const { t } = useTranslation("page");

  const currentFontLabel =
    FONT_SIZES.find((size) => size.value === currentValue)?.label ||
    "editor.text-medium";

  return (
    <SelectionMenu.Dropdown>
      <SelectionMenu.DropdownTrigger>
        <SelectionMenu.Button>{t(currentFontLabel)}</SelectionMenu.Button>
      </SelectionMenu.DropdownTrigger>
      <SelectionMenu.DropdownContent>
        {FONT_SIZES.map((size) => (
          <SelectionMenu.DropdownItem
            key={size.label}
            onClick={() => onChange(size.value)}
          >
            {t(size.label)}
          </SelectionMenu.DropdownItem>
        ))}
      </SelectionMenu.DropdownContent>
    </SelectionMenu.Dropdown>
  );
};
