import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/src/components/reusable/shadcn-ui/input";
import type { UserData } from "@/src/types/user-data.types";
import useInstitutionBasicInfo from "./zustand";

export default function InstitutionNameInput(data: UserData) {
  const { t } = useTranslation("page");
  const { nameState } = useInstitutionBasicInfo();
  const { institutionName, setInstitutionName, setNameChanged } = nameState;

  useEffect(() => {
    if (!data.institution) return;
    setInstitutionName(data.institution.name);
  }, [data.institution?.name]);

  return (
    <div className="col-span-full">
      <label
        htmlFor="text"
        className="block text-sm font-medium leading-6 text-contrast"
      >
        {t("organization_settings.name_logo_organization_name")}
      </label>
      <div className="mt-1">
        <Input
          placeholder={t(
            "organization_settings.name_logo_organization_name_placeholder",
          )}
          id="text"
          name="text"
          type="text"
          value={institutionName}
          autoComplete="text"
          onChange={(e) => {
            setInstitutionName(e.currentTarget.value);
            setNameChanged(true);
          }}
          className="text-contrast"
        />
      </div>
    </div>
  );
}
