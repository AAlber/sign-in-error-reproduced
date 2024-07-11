import { Plus } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { PopoverStringInput } from "@/src/components/reusable/popover-string-input";
import { Button } from "@/src/components/reusable/shadcn-ui/button";

type Props = {
  onSubmit: (value: string) => void;
};

const EmailAdder = ({ onSubmit }: Props) => {
  const { t } = useTranslation("page");
  return (
    <PopoverStringInput actionName="add" onSubmit={onSubmit}>
      <Button className="mt-2" size="lg" variant="link">
        <Plus className="mr-1 h-4 w-4" />
        {t("account_modal.email_overview_add_email_button")}
      </Button>
    </PopoverStringInput>
  );
};

export default EmailAdder;
