import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDebounce } from "@/src/client-functions/client-utils/hooks";
import Tick from "@/src/components/reusable/settings-ticks/tick";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
} from "@/src/components/reusable/shadcn-ui/command";
import LayerOption from "./layer-item";

export default function FilterComponent(props: {
  fetchOptions: (search: string) => Promise<any[]>;
  onMultiSelect: (options: any[]) => void;
  selectedOptions?: string[];
}) {
  const { t } = useTranslation("page");
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);

  useEffect(() => {
    if (props.selectedOptions) {
      props.fetchOptions("").then((options) => {
        setSelectedOptions(
          options
            ? options.filter((option) =>
                props.selectedOptions!.includes(option.id),
              )
            : [],
        );
      });
    } else {
      setSelectedOptions([]);
    }
  }, [props.selectedOptions]);

  useDebounce(
    () => {
      props.fetchOptions(search).then((options) => {
        setOptions(options);
        setLoading(false);
      });
    },
    [search],
    500,
  );

  return (
    <Command className="w-full">
      <CommandInput
        placeholder={t("general.search")}
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        {!loading && options && options.length === 0 && (
          <span className="flex items-center justify-center p-2 text-muted-contrast">
            {t("general.empty")}
          </span>
        )}
        {loading && (
          <CommandLoading className="flex items-center justify-center p-2 font-normal text-muted-contrast">
            {t("general.loading")}
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
                    disabled={false}
                    onSelect={() => {
                      if (props.onMultiSelect && props.selectedOptions) {
                        props.onMultiSelect(
                          props.selectedOptions.includes(option.id)
                            ? props.selectedOptions.filter(
                                (id) => id !== option.id,
                              )
                            : [...props.selectedOptions, option.id],
                        );
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Tick
                        checked={
                          props.selectedOptions?.includes(option.id)
                            ? true
                            : false
                        }
                        onChange={() => console.log("filter changed")}
                      />
                      <LayerOption layer={option} />
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </Command>
  );
}
