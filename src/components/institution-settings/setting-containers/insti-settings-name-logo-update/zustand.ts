import { create } from "zustand";

interface NameState {
  institutionName: string;
  setInstitutionName: (institutionName: string) => void;
  nameChanged: boolean;
  setNameChanged: (nameChanged: boolean) => void;
}

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  languageChanged: boolean;
  setLanguageChanged: (languageChanged: boolean) => void;
}

interface ThemeState {
  modalOpen: boolean;
  setModalOpen: (modalOpen: boolean) => void;
}

interface InstitutionBasicInfoState {
  nameState: NameState;
  themeState: ThemeState;
  languageState: LanguageState;
}

const useInstitutionBasicInfo = create<InstitutionBasicInfoState>()((set) => ({
  nameState: {
    institutionName: "",
    setInstitutionName: (institutionName) =>
      set((state) => ({
        nameState: { ...state.nameState, institutionName },
      })),
    nameChanged: false,
    setNameChanged: (nameChanged) =>
      set((state) => ({
        nameState: { ...state.nameState, nameChanged },
      })),
  },
  themeState: {
    modalOpen: false,
    setModalOpen: (modalOpen) =>
      set((state) => ({
        themeState: { ...state.themeState, modalOpen },
      })),
    customTheme: "#ffffff",
  },
  languageState: {
    language: "en",
    setLanguage: (language) =>
      set((state) => ({
        languageState: { ...state.languageState, language },
      })),
    languageChanged: false,
    setLanguageChanged: (languageChanged) =>
      set((state) => ({
        languageState: { ...state.languageState, languageChanged },
      })),
  },
}));

export default useInstitutionBasicInfo;
