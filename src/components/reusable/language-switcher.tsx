import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import classNames from "@/src/client-functions/client-utils";
import useUser from "@/src/zustand/user";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "./shadcn-ui/select";

type LanguageProps = {
  language: Language;
  setLanguage: (lang: Language) => void;
  open?: boolean;
  variant?: "default" | "ghost-button";
  onOpenChange?: (open: boolean) => any;
  onValueChange?: (value: string) => any;
};

export default function LanguageSelector({
  variant = "default",
  ...props
}: LanguageProps) {
  const { t } = useTranslation("page");
  const { user } = useUser();
  const [open, setOpen] = useState(props.open || false);

  useEffect(() => props.setLanguage(user.language), []);

  return (
    <Select
      value={props.language.toString()}
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (props.onOpenChange) {
          props.onOpenChange(open);
        }
      }}
      onValueChange={(value: string) => {
        props.setLanguage(value as Language);
        if (props.onValueChange) {
          props.onValueChange(value as any);
        }
      }}
    >
      <SelectTrigger
        className={classNames(
          variant === "ghost-button" && "border-0 hover:bg-accent",
        )}
      >
        <p className="text-lg">{props.language === "en" ? "🇬🇧" : "🇩🇪"}</p>
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
              🇩🇪
              <span className="text-contrast"> {t("de")}</span>
            </div>{" "}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
