import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { InstitutionSettings } from "@/src/types/institution-settings.types";
import { defaultInstitutionSettings } from "@/src/types/institution-settings.types";
import type { SettingId } from "./tabs";

export type InstitutionSettingsStore = {
  institutionSettings: InstitutionSettings;
  currentMenuContent: { id: SettingId; title: string } | undefined;
  setMenuContent: (
    view: InstitutionSettingsStore["currentMenuContent"],
  ) => void;
  /** @deprecated */
  current: number;
  /** @deprecated */
  setCurrent: (current: number) => void;
  setInstitutionSettings: (institutionSettings: InstitutionSettings) => void;
  updateInstitutionSettings: (
    institutionSettings: Partial<InstitutionSettings>,
  ) => void;
};

export const useInstitutionSettings = create<InstitutionSettingsStore>()(
  persist(
    (set) => ({
      current: 1,
      institutionSettings: defaultInstitutionSettings,
      currentMenuContent: undefined,
      setMenuContent: (view) => set({ currentMenuContent: view }),
      setInstitutionSettings: (institutionSettings) =>
        set({ institutionSettings }),
      updateInstitutionSettings: (institutionSettings) =>
        set((state) => ({
          institutionSettings: {
            ...state.institutionSettings,
            ...institutionSettings,
          },
        })),
      setCurrent: (current) => set({ current }),
    }),
    { name: "settings" },
  ),
);
