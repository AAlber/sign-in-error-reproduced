import { Plus } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import type { BasicAccountInfo } from "@/src/utils/stripe-types";
import { useAccessPasses } from "../zustand";

export default function AddAccessPassButton({
  accountInfo,
}: {
  accountInfo: BasicAccountInfo;
}) {
  const { setOpenAddAccessPassModal } = useAccessPasses();
  const { setAccountInfo } = useAccessPasses();
  const { t } = useTranslation("page");
  useEffect(() => {
    setAccountInfo(accountInfo);
  }, []);

  return (
    <Button type="button" onClick={() => setOpenAddAccessPassModal(true)}>
      <Plus className="mr-1 h-4 w-4" />
      {t("organization_settings.add_access_pass")}
    </Button>
  );
}
