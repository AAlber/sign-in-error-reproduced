import { Transition } from "@headlessui/react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { setInstitutionUserDataFieldValues } from "@/src/client-functions/client-institution-user-data-field";
import type { InstitutionUserDataFieldValue } from "@/src/types/institution-user-data-field.types";
import { Button } from "../../reusable/shadcn-ui/button";
import { useInstitutionUserManagement } from "../zustand";
import type { UserManagementDataFields } from "./user-custom-field/types";

function UnsavedChangesButton() {
  const [loading, setLoading] = useState(false);
  const refreshList = useInstitutionUserManagement(
    (state) => state.refreshList,
  );

  const { t } = useTranslation("page");
  const { reset, formState, handleSubmit } =
    useFormContext<UserManagementDataFields>();

  const commitChanges = async (v: UserManagementDataFields) => {
    /**
     * key is the cell/textInput identifier, it is in fieldId__userId format
     * see /data-table/user-custom-field/cell.tsx on how it is derived
     */
    const entries = Object.entries(v);
    const values = entries.map<InstitutionUserDataFieldValue>(
      ([key, value]) => {
        const [fieldId, userId] = key.split("__");
        return { fieldId: fieldId!, userId: userId!, value };
      },
    );

    await setInstitutionUserDataFieldValues({
      values,
    });
  };

  return (
    <Transition
      show={formState.isDirty}
      enter="transition-opacity duration-75"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-250"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      className={"flex justify-center bg-red-500/50"}
    >
      <div className="milkblur absolute bottom-2 m-2 flex h-20 w-1/2 items-center justify-between gap-4 rounded-lg border border-border bg-popover p-4 xl:w-1/3">
        <div className="flex flex-col">
          <h2 className="text-sm font-medium text-contrast">
            {t("unsaved-changes")}
          </h2>
          <p className="text-sm text-muted-contrast">
            {t("unsaved-changes-description")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button disabled={loading} onClick={() => reset()}>
            {t("general.discard")}
          </Button>
          <Button
            variant="cta"
            disabled={loading}
            onClick={async (e) => {
              setLoading(true);
              await handleSubmit(commitChanges)(e);
              reset();
              setLoading(false);
              refreshList();
            }}
          >
            {t(loading ? "general.loading" : "general.save")}
          </Button>
        </div>
      </div>
    </Transition>
  );
}

export default UnsavedChangesButton;
