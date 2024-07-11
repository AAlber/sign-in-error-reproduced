import { FileText, Text } from "lucide-react";
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
import { PromptOrigin, useAIAssistant } from "./zustand";

export default function SelectPromptOrigin() {
  const { promptOrigin, setPromptOrigin } = useAIAssistant();
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
      setMenuOpened(false); // Reset the state
    }
  }, [menuOpened]);

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="text-sm text-muted-contrast">
        {t("workbench_ai_assistant_context")}
      </div>

      <Select
        value={promptOrigin.toString()}
        onValueChange={(value: string) => {
          setPromptOrigin(Number(value));
          setMenuOpened(true); // Set the flag to true
          if (triggerRef.current) {
            (triggerRef.current as any).blur();
          }
        }}
      >
        <SelectTrigger ref={triggerRef} className="w-full">
          <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value={PromptOrigin.TEXT.toString()}>
              <div className="flex items-center gap-2">
                <Text size={16} />

                <span className="text-sm font-medium  text-contrast">
                  {t("workbench_ai_assistant_context_text")}
                </span>
              </div>
            </SelectItem>
            <SelectItem value={PromptOrigin.PDF.toString()}>
              <div className="flex items-center gap-2">
                <FileText size={16} />

                <span className="text-sm font-medium  text-contrast">
                  {t("workbench_ai_assistant_context_pdf")}
                </span>
              </div>{" "}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
