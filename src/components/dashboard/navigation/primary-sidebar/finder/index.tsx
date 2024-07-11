"use client";

import * as React from "react";
import { useTranslation } from "react-i18next";
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
  CommandSeparator,
} from "../../../../reusable/shadcn-ui/command";
import ConciergeChat from "./concierge-chat";
import SectionCourses from "./finder-sections/section-courses";
import SectionDashboard from "./finder-sections/section-dashboard";
import SectionSettings from "./finder-sections/section-settings";
import SectionSuggestions from "./finder-sections/section-suggestions";
import SectionConcierge from "./section-concierge";
import useFinder from "./zustand";

export function Finder({ children }) {
  const { t } = useTranslation("page");
  const { open, mode, setOpen } = useFinder();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <button onClick={() => setOpen(true)}>{children}</button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        {mode === "search" ? (
          <>
            <CommandInput placeholder={t("general.search")} />
            <CommandList className="min-h-52">
              <CommandEmpty>{t("general.empty")}</CommandEmpty>
              <SectionConcierge />
              <CommandSeparator />
              <SectionSuggestions />
              <CommandSeparator />
              <SectionDashboard />
              <CommandSeparator />
              <SectionCourses />
              <CommandSeparator />
              <SectionSettings />
            </CommandList>
          </>
        ) : (
          <ConciergeChat />
        )}
      </CommandDialog>
    </>
  );
}
