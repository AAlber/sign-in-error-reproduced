"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/reusable/shadcn-ui/popover";
import useInstitutionBasicInfo from "../../zustand";
import SelectorComponent from "./selector-component";
import PopoverTexts from "./texts";

export default function PaletteSelectorPopover({
  children,
}: {
  children: React.ReactNode;
}) {
  const { themeState } = useInstitutionBasicInfo();
  const { setModalOpen, modalOpen } = themeState;

  if (typeof window === "undefined") return null;

  return (
    <Popover open={modalOpen} onOpenChange={setModalOpen}>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent className="!w-[400px]">
        <PopoverTexts />
        <SelectorComponent />
      </PopoverContent>
    </Popover>
  );
}
