import { create } from "zustand";

export const programmingLanguages = [
  {
    name: "Python",
    logo: "/images/programming/python.svg",
  },
  {
    name: "JavaScript",
    logo: "/images/programming/javascript.svg",
  },
  {
    name: "Java",
    logo: "/images/programming/java.svg",
  },
  {
    name: "C++",
    logo: "/images/programming/cpp.svg",
  },
  {
    name: "C#",
    logo: "/images/programming/csharp.svg",
  },
  {
    name: "C",
    logo: "/images/programming/c.svg",
  },
  {
    name: "Swift",
    logo: "/images/programming/swift.svg",
  },
  {
    name: "Rust",
    logo: "/images/programming/rust.svg",
  },
] as const;

export type ProgrammingLanguage = (typeof programmingLanguages)[number];

interface CodeTask {
  selectedLanguage: ProgrammingLanguage;
  setLanguage: (data: ProgrammingLanguage) => void;
}

const initalState = {
  selectedLanguage: {
    name: "Python",
    logo: "/images/programming/python.svg",
  } as ProgrammingLanguage,
};

export const useCodeTask = create<CodeTask>((set) => ({
  ...initalState,

  setLanguage: (data: ProgrammingLanguage) => set({ selectedLanguage: data }),
}));
