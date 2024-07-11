import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeStore {
  theme: string;
  setLocalTheme: (theme: string) => void;
  instiTheme: any;
  setInstiTheme: (theme: any) => void;
  themeChanged: boolean;
  setThemeChanged: (changed: boolean) => void;
  customTheme: string;
  setCustomTheme: (customTheme: string) => void;
}

const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: "system",
      setLocalTheme: (theme) => set({ theme }),
      instiTheme: "blue",
      setInstiTheme: (theme) => set({ instiTheme: theme }),
      themeChanged: false,
      setThemeChanged: (changed) => set({ themeChanged: changed }),
      customTheme: "#000000",
      setCustomTheme: (customTheme) => set({ customTheme }),
    }),
    {
      name: "theme-storage",
    },
  ),
);

export default useThemeStore;
