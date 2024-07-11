import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  createInstitutionUserDataField,
  updateInstitutionUserDataField,
} from "@/src/client-functions/client-institution-user-data-field";
import { Input } from "@/src/components/reusable/shadcn-ui/input";
import { toast } from "@/src/components/reusable/toaster/toast";
import { useInstitutionUserManagement } from "../../zustand";

export default function Header({ header, id }: { header: string; id: string }) {
  const [value, setValue] = useState(header);
  const [isLoading, setIsLoading] = useState(false);
  const setDataFields = useInstitutionUserManagement(
    (state) => state.setDataFields,
  );

  const { t } = useTranslation("page");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCreate = async () => {
    const dataFields = useInstitutionUserManagement.getState().dataFields;

    switch (true) {
      case !value: {
        if (!header) setDataFields(dataFields.slice(0, -1));
        else setValue(header);
        return;
      }
      case header.trim() === value.trim():
        setValue(value.trim());
        return;
    }

    setIsLoading(true);
    const clone = [...dataFields];
    try {
      if (!header) {
        // if header is not defined, then we are creating new field
        const result = await createInstitutionUserDataField({
          name: value,
          id,
        });

        if (!result || !("id" in result)) {
          setDataFields(dataFields.slice(0, -1)); // revert on error
          return;
        }

        const thisField = dataFields.at(-1)!;
        clone.pop();
        clone.push({ ...thisField, name: value });
        setDataFields(clone);
      } else {
        // we are editing title
        await updateInstitutionUserDataField({ id, name: value });
        setDataFields(
          dataFields.map((field) =>
            field.id === id ? { ...field, name: value } : field,
          ),
        );
      }
    } catch (e) {
      toast.error(t("something_went_wrong"), {});
      setDataFields(clone);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex w-52 items-center justify-between" id={id}>
      <Input
        placeholder={t(
          "organization_settings.user_management_create_column.name",
        )}
        className="cursor-text text-ellipsis !border-transparent !bg-transparent !p-0 focus:!border-transparent"
        onBlur={handleCreate}
        value={value}
        ref={inputRef}
        disabled={isLoading}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            inputRef.current?.blur();
          } else if (e.key === "Escape") {
            setValue("");
            setTimeout(() => {
              inputRef.current?.blur();
            }, 50);
          }
        }}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
