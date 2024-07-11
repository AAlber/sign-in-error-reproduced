import { useTranslation } from "react-i18next";
import { createInstitutionUserDataField } from "@/src/client-functions/client-institution-user-data-field";
import { PopoverStringInput } from "@/src/components/reusable/popover-string-input";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { useInstitutionUserDataFieldsList } from "./zustand";

export default function AddUserDataField() {
  const { t } = useTranslation("page");
  const { userDataFields, setUserDataFields } =
    useInstitutionUserDataFieldsList();
  return (
    <PopoverStringInput
      actionName="general.create"
      onSubmit={async (value) => {
        const dataField = await createInstitutionUserDataField({ name: value });
        if (!dataField) return;
        setUserDataFields([...userDataFields, { ...dataField, valueCount: 0 }]);
      }}
    >
      <Button>{t("general.create")}</Button>
    </PopoverStringInput>
  );
}
