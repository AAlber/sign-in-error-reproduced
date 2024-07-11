import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import useThemeStore from "@/src/components/dashboard/navigation/primary-sidebar/user-menu/theme-switcher/zustand";
import useUser from "@/src/zustand/user";

export function useSyncInstitutionThemeAndLanguage() {
  const user = useUser((state) => state.user);
  const setInstiTheme = useThemeStore((state) => state.setInstiTheme);
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(user.language);
  }, [user.language]);

  useEffect(() => {
    setInstiTheme(user.institution?.theme ?? "blue");
  }, []);
}
