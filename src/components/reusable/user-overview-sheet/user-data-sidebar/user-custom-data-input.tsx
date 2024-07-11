import type { PropsWithChildren } from "react";
import { useFormContext } from "react-hook-form";
import { setInstitutionUserDataFieldValues } from "@/src/client-functions/client-institution-user-data-field";
import { type UserManagementDataFields } from "@/src/components/institution-user-management/data-table/user-custom-field/types";
import type { InstitutionUserManagementUser } from "@/src/types/user-management.types";
import { log } from "@/src/utils/logger/logger";
import { PopoverStringInput } from "../../popover-string-input";
import { Button } from "../../shadcn-ui/button";
import { useUserOverview } from "../zustand";

type Props = {
  fieldId: string;
  user: InstitutionUserManagementUser;
};

export function UserCustomDataInput({
  fieldId,
  user,
  children,
}: PropsWithChildren<Props>) {
  const { setCustomDataLoading } = useUserOverview();
  const { resetField } = useFormContext<UserManagementDataFields>();

  const handleSave = async (value: string) => {
    try {
      const fieldName = `${fieldId}__${user.id}`;
      await setInstitutionUserDataFieldValues({
        values: [{ userId: user.id, fieldId, value }],
      });
      log.info("Successfully added custom data point to user");
      resetField(fieldName, { defaultValue: value });
    } catch (e) {
      log.error(e);
    } finally {
      setCustomDataLoading(false);
    }
  };

  return (
    <PopoverStringInput
      className="w-full"
      actionName="Save"
      onSubmit={handleSave}
    >
      <Button
        variant={"ghost"}
        className="relative -left-2 flex w-full items-center justify-start text-start"
      >
        {children}
      </Button>
    </PopoverStringInput>
  );
}
