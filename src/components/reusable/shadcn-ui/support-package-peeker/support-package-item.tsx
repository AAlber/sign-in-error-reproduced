"use client";

import { CheckIcon } from "@radix-ui/react-icons";
import * as React from "react";
import type { SupportPackages } from "@/src/client-functions/client-stripe/price-id-manager";
import { getSupportPackageNameFromValue } from "@/src/client-functions/client-stripe/price-id-manager";
import classNames from "@/src/client-functions/client-utils";
import { CommandItem } from "../command";

interface SupportPackageItemProps {
  supportPackage: SupportPackages;
  isSelected: boolean;
  onSelect: () => void;
  onPeek: (supportPackage: SupportPackages) => void;
}
export default function SupportPackageItem({
  supportPackage,
  isSelected,
  onSelect,
  onPeek,
}: SupportPackageItemProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const handleMouseEnter = () => {
    onPeek(supportPackage);
  };

  return (
    <CommandItem
      key={supportPackage}
      onSelect={onSelect}
      ref={ref}
      onMouseEnter={handleMouseEnter}
      className="aria-selected:bg-primary "
    >
      {getSupportPackageNameFromValue(supportPackage)}
      <CheckIcon
        className={classNames(
          "ml-auto h-4 w-4",
          isSelected ? "opacity-100" : "opacity-0",
        )}
      />
    </CommandItem>
  );
}
