import { Globe } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { updateUser } from "@/src/client-functions/client-user";
import type { UserData } from "@/src/types/user-data.types";
import useUser from "@/src/zustand/user";
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "../../../../../reusable/shadcn-ui/dropdown-menu";

export const changeLanguage = (i18n, user: UserData) => {
  return i18n.changeLanguage(user.language);
};

export default function LanguageSwitcher() {
  const { user, setUser } = useUser();
  const { i18n } = useTranslation();
  const { t } = useTranslation("page");

  useEffect(() => {
    changeLanguage(i18n, user);
  }, [user.language]);

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <Globe className="h-4 w-4" />
        {t("user_menu.option3")}
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="mr-3">
        <DropdownMenuLabel className="flex flex-col text-contrast">
          {t("user_menu.option3_submenu_title")}
          <span className="text-xs font-normal text-muted-contrast">
            {t("user_menu.option3_submenu_sub_title")}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setUser({ language: "en" });
            updateUser({ language: "en" });
            changeLanguage(i18n, user);
          }}
        >
          🇬🇧 English
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            setUser({ language: "de" });
            updateUser({ language: "de" });
            changeLanguage(i18n, user);
          }}
        >
          🇩🇪 Deutsch
        </DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}
