import { create } from "zustand";

const institutionState = {
  name: "",
  logoLink: undefined,
  language: "en" as Language,
};

const initalState = {
  step: 1,
  farthestStep: 1,
  loadingStep: 2,
  ...institutionState,
};

interface InstitutionOnboarding {
  step: number;
  setStep: (data: number) => void;

  farthestStep: number;

  loadingStep: number;
  setLoadingStep: (data: number) => void;

  name: string;
  setName: (data: string) => void;

  logoLink: string | undefined;
  setLogoLink: (data: string | undefined) => void;

  language: Language;
  setLanguage: (data: Language) => void;
}

const useInstitutionOnboarding = create<InstitutionOnboarding>((set) => ({
  ...initalState,
  setStep: (data) =>
    set((state) => {
      if (data > state.farthestStep) {
        set(() => ({ farthestStep: data }));
      }
      return { step: data };
    }),
  setLanguage: (data) => set(() => ({ language: data })),
  setLoadingStep: (data) => set(() => ({ loadingStep: data })),
  setName: (data) => set(() => ({ name: data })),
  setLogoLink: (data) => set(() => ({ logoLink: data })),
}));

export default useInstitutionOnboarding;
