import React from "react";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../reusable/shadcn-ui/select";
import { useAIAssistant } from "./zustand";

export default function SelectSectionPage() {
  const { type, setType } = useAIAssistant();
  const { t } = useTranslation("page");
  const triggerRef = React.useRef(null);

  const [menuOpened, setMenuOpened] = React.useState(false);

  React.useEffect(() => {
    if (menuOpened && triggerRef.current) {
      // Using setTimeout to ensure blur is called after Radix UI's internal focus management
      setTimeout(() => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }, 0);
      setMenuOpened(false);
    }
  }, [menuOpened]);

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="text-sm text-muted-contrast">{t("type")}</div>
      <Select
        value={type}
        onValueChange={(value: "section" | "page") => {
          setType(value);
          setMenuOpened(true); // Set the flag to true
          if (triggerRef.current) {
            (triggerRef.current as any).blur();
          }
        }}
      >
        <SelectTrigger ref={triggerRef} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="section">
              {t("workbench_ai_assistant_type_elements")}
            </SelectItem>
            <SelectItem value="page">
              {t("workbench_ai_assistant_type_page")}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
