import { Fragment, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import classNames from "../../../../client-functions/client-utils";
import useWorkbench, { WorkbenchMode } from "../../zustand";
import TaskInput from "../misc/task-input";

export function ElementBody(elementId) {
  return (
    <div className="flex w-full flex-col">
      <TaskInput elementId={elementId} />
      <InputGrid elementId={elementId} />
    </div>
  );
}

interface InputGridProps {
  elementId: string;
}

function InputGrid(props: InputGridProps) {
  const inputElement = useRef<HTMLInputElement>(null);
  const { getElementMetadata, updateElementMetadata, mode } = useWorkbench();
  const { t } = useTranslation("page");

  useEffect(() => {
    if (inputElement.current) inputElement.current.focus();
  }, [inputElement]);

  return (
    <div className="grid grid-cols-4 gap-6">
      <div className="col-span-4">
        <div className="mt-2">
          <div className="flex min-h-10 w-full flex-wrap gap-y-1 rounded-[4px]  border-border text-contrast outline-none ring-0 placeholder:text-muted focus:border-secondary focus:outline-none focus:ring-0 ">
            {(getElementMetadata(props.elementId).options
              ? getElementMetadata(props.elementId).options
              : []
            ).map((option, idx) => (
              <Fragment key={idx}>
                {option}
                <input
                  disabled={mode !== WorkbenchMode.FILLOUT}
                  onChange={(e) => {
                    const textFields = getElementMetadata(props.elementId)
                      .textFields
                      ? [...getElementMetadata(props.elementId).textFields]
                      : [];
                    textFields[idx] = e.target.value;
                    updateElementMetadata(props.elementId, { textFields });
                  }}
                  value={
                    getElementMetadata(props.elementId).textFields
                      ? getElementMetadata(props.elementId).textFields[idx]
                      : ""
                  }
                  className="mx-1 inline-flex shrink-0 items-center justify-center rounded-md border border-border bg-transparent px-1 "
                ></input>
              </Fragment>
            ))}
            <input
              onKeyDown={(e) => {
                if (
                  e.key === "Backspace" &&
                  getElementMetadata(props.elementId)?.option.length === 0
                ) {
                  const text = getElementMetadata(props.elementId)?.options[
                    getElementMetadata(props.elementId)?.options.length - 1
                  ];
                  updateElementMetadata(props.elementId, {
                    options: getElementMetadata(props.elementId).options.slice(
                      0,
                      -1,
                    ),
                  });
                  updateElementMetadata(props.elementId, { option: text });
                }
                if (e.key === "Enter") {
                  if (getElementMetadata(props.elementId)?.option.length > 0) {
                    updateElementMetadata(props.elementId, {
                      options: [
                        ...(getElementMetadata(props.elementId).options ?? []),
                        getElementMetadata(props.elementId)?.option,
                      ],
                    });
                    updateElementMetadata(props.elementId, { option: "" });
                  }
                }
              }}
              value={getElementMetadata(props.elementId)?.option ?? ""}
              onChange={(e) => {
                if (mode !== WorkbenchMode.CREATE) return;
                updateElementMetadata(props.elementId, {
                  option: e.target.value,
                });
              }}
              placeholder={
                (getElementMetadata(props.elementId).options
                  ? getElementMetadata(props.elementId).options
                  : []
                ).length === 0
                  ? t("workbench.sidebar_element_fill_the_blanks_placeholder")
                  : ""
              }
              className="block grow rounded-[4px] bg-background text-contrast outline-none ring-0 placeholder:text-muted focus:border-secondary focus:outline-none focus:ring-0 "
            />
          </div>
          {mode === WorkbenchMode.CREATE && (
            <div className="mt-2 flex w-full items-center justify-end text-sm text-muted-contrast">
              {t("workbench.sidebar_element_fill_the_blanks_add1")}
              <kbd
                className={classNames(
                  "ml-1 mr-1 flex h-4 w-4 items-center justify-center rounded border bg-background font-semibold",
                  "border-border text-contrast",
                )}
              >
                <svg
                  className="h-3 w-3 fill-contrast"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M19,6a1,1,0,0,0-1,1v4a1,1,0,0,1-1,1H7.41l1.3-1.29A1,1,0,0,0,7.29,9.29l-3,3a1,1,0,0,0-.21.33,1,1,0,0,0,0,.76,1,1,0,0,0,.21.33l3,3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42L7.41,14H17a3,3,0,0,0,3-3V7A1,1,0,0,0,19,6Z" />
                </svg>
              </kbd>
              {t("workbench.sidebar_element_fill_the_blanks_add2")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
