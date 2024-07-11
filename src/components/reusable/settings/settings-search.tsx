import * as React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../shadcn-ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../shadcn-ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn-ui/popover";

export function SettingsSearch(props: SettingsSearchProps) {
  const [open, setOpen] = React.useState(false);

  const { t } = useTranslation("page");

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full flex-1 justify-between md:max-w-[200px] lg:max-w-[300px]"
        >
          Search...
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder={t("general.search")} />
          <CommandGroup>
            {props.tabs
              .filter((tab) => tab.type === "button")
              .map((tab) => {
                if (tab.type === "button")
                  return (
                    <CommandItem
                      key={tab.id}
                      onSelect={() => {
                        props.setActiveTab(tab.id);
                        setOpen(false);
                      }}
                    >
                      {t(tab.name)}
                    </CommandItem>
                  );
              })}
          </CommandGroup>
          {props.tabs
            .filter((tab) => tab.type === "menu")
            .map((tab) => {
              if (tab.type === "menu")
                return (
                  <CommandGroup heading={t(tab.name)}>
                    {tab.tabs.map((item) => {
                      return (
                        <CommandItem
                          key={item.id}
                          onSelect={() => {
                            props.setActiveTab(item.id);
                            setOpen(false);
                          }}
                        >
                          {t(item.name)}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                );
            })}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
