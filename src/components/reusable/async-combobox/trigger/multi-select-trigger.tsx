import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import classNames, { truncate } from "@/src/client-functions/client-utils";
import type { AsyncComboboxProps } from "../types";

type MultiSelectTriggerProps = AsyncComboboxProps & {
  options: any[];
};

export default function MultiSelectTrigger(props: MultiSelectTriggerProps) {
  const { t } = useTranslation("page");

  return (
    <div className="flex items-center gap-x-1.5">
      <div className="flex items-center gap-2">
        <div
          className={classNames(
            "flex items-center",
            props.selectedOptions &&
              props.selectedOptions.length > 0 &&
              "border-r border-border pr-2",
          )}
        >
          {t(props.placeholder)}
        </div>

        {props.selectedOptions && props.selectedOptions.length < 3 ? (
          <>
            {props.options.map((option) => (
              <div
                className="flex h-6 max-w-[100px] items-center gap-x-1 overflow-hidden text-ellipsis rounded-md border border-dashed border-border px-2 "
                key={option.id}
              >
                {truncate(option.name, 10)}
              </div>
            ))}
          </>
        ) : (
          <div className="flex items-center gap-x-1 rounded-md border border-dashed border-border px-2 ">
            {props.selectedOptions && props.selectedOptions.length} selected
          </div>
        )}
      </div>

      {props.selectedOptions && props.selectedOptions.length > 0 && (
        <button
          onClick={() => {
            if (props.onMultiSelect) props.onMultiSelect([]);
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
