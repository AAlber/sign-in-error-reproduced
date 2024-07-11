import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useUser from "@/src/zustand/user";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "../../reusable/shadcn-ui/select";
import { useAIAssistant } from "./zustand";

export default function SelectLanguage() {
  const { user } = useUser();
  const { language, setLanguage, setOpen: setO } = useAIAssistant();
  const { t } = useTranslation("page");

  const [open, setOpen] = useState(false);

  useEffect(() => setLanguage(user.language), []);

  return (
    <Select
      defaultValue={user.language}
      value={language.toString()}
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        setO(true);
      }}
      onValueChange={(value: string) => setLanguage(value as any)}
    >
      <SelectTrigger className="">
        {language === "en" ? "🇬🇧" : "🇩🇪"}
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value={"en"}>
            <div className="flex items-center gap-2">
              🇬🇧
              <span className="text-contrast"> {t("en")}</span>
            </div>
          </SelectItem>
          <SelectItem value={"de"}>
            <div className="flex items-center gap-2">
              🇩🇪 <span className="text-contrast"> {t("de")}</span>
            </div>{" "}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
