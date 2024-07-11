"use client";

import { CaretSortIcon } from "@radix-ui/react-icons";
import type { PopoverProps } from "@radix-ui/react-popover";
import * as React from "react";
import { useTranslation } from "react-i18next";
import type { SupportPackages } from "@/src/client-functions/client-stripe/price-id-manager";
import {
  getSupportPackageNameFromValue,
  supportPackageArray,
} from "@/src/client-functions/client-stripe/price-id-manager";
import classNames from "@/src/client-functions/client-utils";
import { usePlanSelector } from "@/src/components/institution-settings/setting-containers/insti-settings-billing/plan-selector/zustand";
import { Button } from "../button";
import { Command, CommandGroup, CommandList } from "../command";
import { HoverCard, HoverCardSheet, HoverCardTrigger } from "../hover-card";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { FeatureList } from "./feature-list";
import SupportPackageItem from "./support-package-item";

export function SupportPackagePeeker({
  ...props
}: PopoverProps & { peekDirection?: "left" | "right" }) {
  const [open, setOpen] = React.useState(false);
  const { supportPackage, setSupportPackage } = usePlanSelector();
  const [selectedPackage, setSelectedPackage] =
    React.useState<SupportPackages>(supportPackage);
  const [peekedPackage, setPeekedPackage] =
    React.useState<SupportPackages>(supportPackage);

  const selectedPackageName = getSupportPackageNameFromValue(selectedPackage);
  const { t } = useTranslation("page");
  return (
    <div className="grid gap-2">
      <Popover open={open} onOpenChange={setOpen} {...props}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a model"
            className="w-full justify-between"
          >
            <div
              className={classNames(
                selectedPackage === "none"
                  ? "text-muted-contrast"
                  : "text-contrast",
              )}
            >
              {selectedPackageName}
            </div>
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[250px] p-0">
          <HoverCard>
            <HoverCardSheet
              side="left"
              align="start"
              forceMount
              className={classNames(
                "min-w-[330px] bg-background max-md:hidden ",
                props.peekDirection === "left"
                  ? "max-2xl:!absolute max-2xl:!right-[0px]"
                  : "max-2xl:!absolute max-2xl:!left-[260px]",
              )}
            >
              <div className="grid gap-2 ">
                <h4 className="font-medium leading-none">
                  {getSupportPackageNameFromValue(peekedPackage)}
                </h4>
                <FeatureList supportPackage={peekedPackage} />
              </div>
            </HoverCardSheet>
            <Command loop>
              <CommandList className="max-h-[550px]">
                <HoverCardTrigger />
                <CommandGroup>
                  {supportPackageArray.map((supportPackage, index) => (
                    <SupportPackageItem
                      key={supportPackage}
                      supportPackage={supportPackage}
                      isSelected={selectedPackage === supportPackage}
                      onPeek={(supportPackage) =>
                        setPeekedPackage(supportPackage)
                      }
                      onSelect={() => {
                        setSelectedPackage(supportPackage);
                        setSupportPackage(supportPackage);
                        setOpen(false);
                      }}
                    />
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </HoverCard>
        </PopoverContent>
      </Popover>
    </div>
  );
}
