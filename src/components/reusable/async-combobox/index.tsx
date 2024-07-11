import { PlusCircle } from "lucide-react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useDebounce } from "@/src/client-functions/client-utils/hooks";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
  CommandSeparator,
} from "@/src/components/reusable/shadcn-ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/reusable/shadcn-ui/popover";
import Tick from "../settings-ticks/tick";
import Trigger from "./trigger";
import type { AsyncComboboxProps } from "./types";

export function AsyncCombobox(props: AsyncComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState<any>(null);
  const [options, setOptions] = React.useState<any[]>([]);
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [selectedOptions, setSelectedOptions] = React.useState<any[]>([]);
  const { t } = useTranslation("page");

  React.useEffect(() => {
    if (props.mode !== "multi-select") return;
    if (props.selectedOptions) {
      props.fetchOptions("").then((options) => {
        setSelectedOptions(
          options.filter((option) =>
            props.selectedOptions!.includes(option.id),
          ),
        );
      });
    } else {
      setSelectedOptions([]);
    }
  }, [props.selectedOptions]);

  React.useEffect(() => {
    setLoading(true);
    props.fetchOptions(search).then((options) => {
      setOptions(options);
      setLoading(false);
    });
  }, [open]);

  useDebounce(
    () => {
      setLoading(true);
      props.fetchOptions(search).then((options) => {
        setOptions(options);
        setLoading(false);
      });
    },
    [search],
    500,
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="flex h-8 w-full cursor-pointer items-center rounded-md border border-border bg-background p-2 text-sm font-medium text-contrast shadow-sm hover:bg-foreground">
          <Trigger
            {...props}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            options={selectedOptions}
            allowRemoveSelected={props.allowRemoveSelected}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0" side="bottom" align="start">
        <Command>
          <CommandInput
            placeholder={t(props.searchPlaceholder)}
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {!loading &&
              options &&
              options.length === 0 &&
              props.noOptionsPlaceholder && (
                <span className="flex items-center justify-center p-2 text-muted-contrast">
                  {props.noOptionsPlaceholder}
                </span>
              )}
            {loading && (
              <CommandLoading className="flex items-center justify-center p-2 font-normal text-muted-contrast">
                Loading...
              </CommandLoading>
            )}
            {!loading && (
              <>
                <CommandGroup>
                  {options.map((option) => {
                    return (
                      <CommandItem
                        key={option.id}
                        value={option.name + option.id}
                        disabled={props.optionIsDisabled?.(option)}
                        onSelect={() => {
                          if (props.onSelect) props.onSelect(option.id);
                          if (props.mode === "select")
                            setSelectedOption(option);
                          if (
                            props.mode === "multi-select" &&
                            props.onMultiSelect &&
                            props.selectedOptions
                          ) {
                            props.onMultiSelect(
                              props.selectedOptions?.includes(option.id)
                                ? props.selectedOptions.filter(
                                    (id) => id !== option.id,
                                  )
                                : [...props.selectedOptions, option.id],
                            );
                          }
                          if (props.mode !== "multi-select") setOpen(false);
                        }}
                      >
                        {props.mode !== "multi-select" &&
                          props.optionComponent(option)}
                        {props.mode === "multi-select" && (
                          <div className="flex items-center gap-2">
                            <Tick
                              checked={
                                props.selectedOptions?.includes(option.id)
                                  ? true
                                  : false
                              }
                              onChange={() => console.log("filter changed")}
                            />
                            {props.optionComponent(option)}
                          </div>
                        )}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
                {props.createAction && (
                  <>
                    <CommandSeparator />
                    <CommandGroup>
                      <CommandItem
                        onSelect={() => {
                          setOpen(false);
                          props.createAction?.();
                        }}
                      >
                        <PlusCircle className="mr-2 size-4" />
                        {t("general.create")}
                      </CommandItem>
                    </CommandGroup>
                  </>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
