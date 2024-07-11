import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { useInstitutionSettings } from "../../zustand";

export default function InstiSettingsWithMenuHeader() {
  const { t } = useTranslation("page");
  const { currentMenuContent, setMenuContent } = useInstitutionSettings();

  if (!currentMenuContent) return null;
  return (
    <div className="flex items-center gap-2">
      <Button
        variant={"ghost"}
        size={"icon"}
        onClick={() => {
          setMenuContent(undefined);
        }}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <span>{t(currentMenuContent.title)}</span>
    </div>
  );
}
