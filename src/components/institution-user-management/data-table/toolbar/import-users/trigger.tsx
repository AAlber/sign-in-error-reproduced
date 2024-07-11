import { useTranslation } from "react-i18next";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import useImportUser from "./zustand";

export default function ImportUsersTrigger() {
  const { setOpen } = useImportUser();
  const { t } = useTranslation("page");

  return (
    <Button onClick={() => setOpen(true)}>
      <span>{t("general.import")}</span>
    </Button>
  );
}
