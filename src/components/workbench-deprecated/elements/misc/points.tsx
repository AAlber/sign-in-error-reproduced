import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { updateAssessmentUserDocument } from "@/src/client-functions/client-assessment";
import classNames from "@/src/client-functions/client-utils";
import {
  areObjectsValueEqual,
  useCustomForm,
} from "@/src/client-functions/client-workbench";
import ControlledInput from "../../components/controlled-input";
import useWorkbench, { WorkbenchMode } from "../../zustand";

type PointsField = {
  points: number;
  achieved_points: number;
};

function Points({ elementId }) {
  const {
    getElementMetadata,
    updateElementMetadata,
    content,
    mode,
    selectedUser,
    updateDocument,
  } = useWorkbench();

  const { t } = useTranslation("page");

  const [loading, setLoading] = useState(false);

  const { points, achieved_points } = getElementMetadata(elementId);

  const { control, handleSubmit, formState, setValue } =
    useCustomForm<PointsField>({
      formProps: {
        defaultValues: {
          points,
          achieved_points,
        },
      },
      key: ["achieved_points", "points"],
      elementId,
      ...(mode === WorkbenchMode.CREATE
        ? { onSubmitHandler: handleUpdateMeta }
        : {}),
    });

  async function updatePoints() {
    if (!selectedUser?.id) return;

    setLoading(true);
    const stringifiedContent = JSON.stringify(content, null, 2);
    updateDocument(selectedUser.id, stringifiedContent);
    await updateAssessmentUserDocument({
      userId: selectedUser.id,
      status: 2,
    });

    setLoading(false);
  }

  function handleUpdateMeta(value: PointsField) {
    if (
      areObjectsValueEqual(
        { points: value.points, achieved_points: value.achieved_points },
        { points, achieved_points },
      )
    ) {
      return;
    }

    updateElementMetadata(elementId, value);

    if (mode === WorkbenchMode.REVIEW) {
      updatePoints();
    }
  }

  if (mode > 0 && !points) return null;
  if (!selectedUser && mode === WorkbenchMode.REVIEW) return null;
  if (loading) {
    return (
      <div className="mt-2 flex items-center gap-1 text-contrast">
        Loading...
      </div>
    );
  }

  const className = classNames(
    "mt-1.5 flex max-w-[100px] select-auto items-end justify-start border-transparent bg-transparent text-right outline-none ring-0 placeholder:text-muted focus:border-transparent focus:outline-none focus:ring-0 p-0",
    !!!formState.errors && "hidden",
  );

  return (
    <div
      className="mt-0.5 flex items-center gap-1 text-contrast"
      onBlur={handleSubmit(handleUpdateMeta)}
    >
      {mode >= 2 && (
        <ControlledInput
          type="input"
          control={control}
          name="achieved_points"
          inputProps={{
            placeholder: t("workbench.element_points_input_placeholder1"),
            disabled: mode !== 2,
            className,
          }}
        />
      )}
      {points && mode >= 2 && <span className="mt-1.5">/ {points} P</span>}
      {mode < 2 && (
        <ControlledInput
          control={control}
          name="points"
          type="input"
          rules={{
            onChange(event) {
              const value = event.target.value;
              if (isNaN(value)) {
                setValue("points", 0);
              }
            },
          }}
          inputProps={{
            disabled: mode > 0,
            placeholder: t("workbench.element_points_input_placeholder2"),
            className,
          }}
        />
      )}
      {points && mode < 2 && <span className="mt-1.5">P</span>}
    </div>
  );
}

export default React.memo(Points);
