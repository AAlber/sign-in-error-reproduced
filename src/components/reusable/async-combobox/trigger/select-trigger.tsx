import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { AsyncComboboxProps } from "../types";

type SelectTriggerProps = AsyncComboboxProps & {
  loadSelected: boolean;
  selectedOption: any;
  setSelectedOption: (option: any) => void;
  allowRemoveSelected?: boolean;
};

export default function SelectTrigger(props: SelectTriggerProps) {
  const { t } = useTranslation("page");

  return (
    <>
      {props.loadSelected ? (
        <div className="text-muted-contrast">Loading...</div>
      ) : props.selected ? (
        <>
          {props.selectedComponent &&
            props.selectedComponent(props.selectedOption)}
          {props.allowRemoveSelected !== false && (
            <button
              onClick={() => {
                props.setSelectedOption(null);
                if (props.onSelect) props.onSelect(null);
              }}
              className="absolute right-9"
            >
              <X size={16} />
            </button>
          )}
        </>
      ) : (
        <div className="text-contrast">{t(props.placeholder)}</div>
      )}
    </>
  );
}
