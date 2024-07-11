import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { AsyncComboboxProps } from "../types";
import MultiSelectTrigger from "./multi-select-trigger";
import SelectTrigger from "./select-trigger";

type TriggerProps = AsyncComboboxProps & {
  selectedOption: any;
  setSelectedOption: (option: any) => void;
  options: any[];
  allowRemoveSelected?: boolean;
};

export default function Trigger(props: TriggerProps) {
  const [loadSelected, setLoadSelected] = useState(true);
  const { t } = useTranslation("page");

  useEffect(() => {
    if (props.mode !== "select") return;
    if (props.selected) {
      setLoadSelected(true);
      props.fetchOptions(props.selected).then((options) => {
        props.setSelectedOption(options[0]);
        setLoadSelected(false);
      });
    } else {
      props.setSelectedOption(null);
      setLoadSelected(false);
    }
  }, [props.selected]);

  return (
    <>
      {props.mode === "select" && (
        <SelectTrigger
          {...props}
          loadSelected={loadSelected}
          selectedOption={props.selectedOption}
          setSelectedOption={props.setSelectedOption}
          allowRemoveSelected={props.allowRemoveSelected}
        />
      )}
      {props.mode === "instant-action" && <>{t(props.placeholder)}</>}
      {props.mode === "multi-select" && (
        <MultiSelectTrigger {...props} options={props.options} />
      )}
    </>
  );
}
