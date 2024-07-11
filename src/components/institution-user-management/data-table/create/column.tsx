import cuid from "cuid";
import { Table2Icon } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { DropdownMenuItem } from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import useUser from "@/src/zustand/user";
import { useInstitutionUserManagement } from "../../zustand";

export function Trigger() {
  const { t } = useTranslation("page");
  const { dataFields, setDataFields } = useInstitutionUserManagement();
  const { user } = useUser();

  const handleClick = () => {
    const id = cuid();

    setDataFields([
      ...dataFields,
      {
        name: "",
        id,
        institutionId: user.currentInstitutionId,
        collectFromUser: false,
        showOnStudentIDCard: false,
      },
    ]);

    let inputElem: HTMLInputElement | null;
    setTimeout(() => {
      const element = document.getElementById(id);
      const parentCell = element?.parentElement;
      parentCell?.scrollIntoView({ behavior: "smooth" });

      inputElem = parentCell?.querySelector("input") ?? null;
    }, 300);

    setTimeout(() => {
      inputElem?.focus();
    }, 700);
  };

  return (
    <DropdownMenuItem onClick={handleClick}>
      <Table2Icon className="h-4 w-4" />
      <span>{t("organization_settings.user_management.trigger.column")}</span>
    </DropdownMenuItem>
  );
}
