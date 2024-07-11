import { Bot, Check, X } from "lucide-react";
import { create } from "zustand";

export type UserStatusCheckboxMode = {
  name: "automatic" | "passed" | "failed";
  description: string;
  icon: JSX.Element;
};

export const modes: UserStatusCheckboxMode[] = [
  {
    name: "automatic",
    description: "automatic_description",
    icon: <Bot className="h-5 w-5" />,
  },
  {
    name: "passed",
    description: "passed_description",
    icon: <Check className="h-5 w-5" />,
  },
  {
    name: "failed",
    description: "failed_description",
    icon: <X className="h-5 w-5" />,
  },
];

interface UserStatusCheckbox {
  mode: "automatic" | "passed" | "failed";
  notes: string;
  setMode: (mode: "automatic" | "passed" | "failed") => void;
  setNotes: (notes: string) => void;
}

const initalState = {
  mode: "automatic" as "automatic" | "passed" | "failed",
  notes: "",
};

const useUserStatusCheckbox = create<UserStatusCheckbox>()((set) => ({
  ...initalState,
  setMode: (mode) => set({ mode }),
  setNotes: (notes) => set({ notes }),
}));
export default useUserStatusCheckbox;
