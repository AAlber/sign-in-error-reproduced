import { LifeBuoy, LogOut, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useIntercom } from "react-use-intercom";
import useUser from "@/src/zustand/user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../reusable/shadcn-ui/dropdown-menu";
import UserDefaultImage from "../../../../user-default-image";
import useAccountOverview from "./account/zustand";
import LanguageSwitcher from "./language-switcher/language-switcher";
import { ThemeSwitcher } from "./theme-switcher";

export default function UserMenu() {
  const { user } = useUser();
  const { t } = useTranslation("page");
  const { show } = useIntercom();
  const { setOpen } = useAccountOverview();
  if (!user) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="border-transparent outline-none ring-0 focus:border-transparent focus:outline-none focus:ring-0">
        <div className="relative my-2 flex size-6 items-center justify-center rounded-full bg-foreground text-sm text-contrast outline-none ring-0 hover:opacity-80 focus:border-transparent focus:outline-none focus:ring-0">
          <UserDefaultImage
            dimensions="size-6"
            user={user}
            border="border-transparent"
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="ml-3 mt-1 w-56">
        <DropdownMenuItem onClick={() => setOpen(true)}>
          <User className="size-4" />
          {t("user_menu.option2")}
        </DropdownMenuItem>
        <LanguageSwitcher />
        <ThemeSwitcher />
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={show}>
          <LifeBuoy className="size-4" />
          {t("contact_support")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.location.assign("/sign-out")}>
          <LogOut size={16} className="size-4" />
          {t("user_menu.option4")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
