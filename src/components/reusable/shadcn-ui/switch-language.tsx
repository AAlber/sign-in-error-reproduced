import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { updateUser } from "@/src/client-functions/client-user";
import type { UserData } from "@/src/types/user-data.types";
import useUser from "@/src/zustand/user";
import { Button } from "../shadcn-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../shadcn-ui/dropdown-menu";

export const changeLanguage = (i18n, user: UserData) => {
  return i18n.changeLanguage(user.language);
};

export default function SwitchLanguage() {
  const { user, setUser } = useUser();
  const { i18n } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} size={"small"}>
          <div className="flex items-center justify-between font-normal">
            <div className="flex items-center gap-2">
              <span className="text-sm">
                {user.language === "en" ? "🇬🇧 English" : " 🇩🇪 Deutsch"}
              </span>
            </div>
            <ChevronDown className="ml-3 size-4 text-muted-contrast" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="hover:bg-muted"
          onClick={() => {
            setUser({ language: "en" });
            updateUser({ language: "en" });
            changeLanguage(i18n, user);
          }}
        >
          🇬🇧 English
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:bg-muted"
          onClick={() => {
            setUser({ language: "de" });
            updateUser({ language: "de" });
            changeLanguage(i18n, user);
          }}
        >
          🇩🇪 Deutsch
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
