import { SearchX } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import classNames from "@/src/client-functions/client-utils";
import { log } from "@/src/utils/logger/logger";
import AsyncComponent from "../async-component";
import { EmptyState } from "../empty-state";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandLoading,
} from "../shadcn-ui/command";
import {
  HoverCard,
  HoverCardSheet,
  HoverCardTrigger,
} from "../shadcn-ui/hover-card";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn-ui/popover";

type AsyncSelectProps<T> =
  | AsyncSelectPropsWithoutHoverCard<T>
  | AsyncSelectPropsWithHoverCard<T>;

type AsyncSelectPropsBase<T> = {
  trigger?: JSX.Element;
  openWithShortcut?: boolean; // Made optional
  placeholder: string;
  noDataMessage?: string; // Made optional
  side?: "left" | "right" | "top" | "bottom";
  onSearch?: (value: string) => void;
  refreshTrigger?: string;
  fetchData: () => Promise<T[]>;
  onSelect: (item: T) => void;
  searchValue: (item: T) => string;
  itemComponent: (item: T) => JSX.Element;
  filter?: (item: T) => boolean;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  emptyState?: React.ReactNode;
};

type AsyncSelectPropsWithoutHoverCard<T> = AsyncSelectPropsBase<T> & {
  renderHoverCard?: false; // Made optional
};

type AsyncSelectPropsWithHoverCard<T> = AsyncSelectPropsBase<T> & {
  renderHoverCard?: true; // Made optional
  hoverCard: (item: T) => JSX.Element | null;
};

/**
 * AsyncSelect is a generic React component that renders a popover with an async-select functionality.
 * It allows users to select an item from a list that is fetched asynchronously.
 *
 * Type Parameters:
 * @template T The type of the items to be fetched and displayed.
 *
 * Props:
 * @param {AsyncSelectProps<T>} props The props for the AsyncSelect component.
 *
 * @param {JSX.Element} [props.trigger] JSX element to be used as the trigger for the popover.
 * @param {boolean} [props.openWithShortcut=false] If true, allows opening the popover with a keyboard shortcut.
 * @param {string} props.placeholder Placeholder text for the command input.
 * @param {string} [props.noDataMessage="general.empty"] Message to display when there is no data.
 * @param {"left" | "right" | "top" | "bottom"} [props.side="right"] The side where the popover will appear.
 * @param {() => Promise<T[]>} props.fetchData Function to fetch the list of items asynchronously.
 * @param {(item: T) => void} props.onSelect Function to handle item selection.
 * @param {(item: T) => string} props.searchValue Function to determine the search value of an item.
 * @param {(item: T) => JSX.Element} props.itemComponent Component to render each item.
 * @param {(item: T) => boolean} [props.filter] Function to filter the items.
 * @param {boolean} [props.open] Controlled state of popover's open status.
 * @param {(open: boolean) => void} [props.setOpen] Function to control the open status of the popover.
 * @param {boolean} [props.renderHoverCard=false] If true, enables rendering of a hover card.
 * @param {(item: T) => JSX.Element | null} [props.hoverCard] Function to render the hover card.
 *
 * @return {JSX.Element} The rendered AsyncSelect component.
 */

export default function AsyncSelect<T>({ ...props }: AsyncSelectProps<T>) {
  const [nativeOpen, setNativeOpen] = useState(false);
  const [peekedItem, setPeekedItem] = useState<T | null>(null);
  const { t } = useTranslation("page");

  const open = props.open ?? nativeOpen;
  const setOpen = props.setOpen ?? setNativeOpen;

  // Provide default values
  const openWithShortcut = props.openWithShortcut ?? false;
  const noDataMessage = props.noDataMessage ?? "empty_state.no_data";
  const renderHoverCard = props.renderHoverCard ?? false;

  useEffect(() => {
    if (!openWithShortcut) return;
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && e.metaKey) {
        setOpen(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [openWithShortcut]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="cursor-pointer">
        {props.trigger}
      </PopoverTrigger>
      <PopoverContent
        side={props.side || "right"}
        className="ml-5 mt-2 w-[300px] p-0"
      >
        <HoverCard>
          {peekedItem && renderHoverCard && (
            <HoverCardSheet
              side="left"
              align="start"
              forceMount
              className={classNames(
                "max-md:hidden",
                props.renderHoverCard &&
                  !props.hoverCard(peekedItem) &&
                  "opacity-0",
                "w-[250px] bg-background",
              )}
            >
              {props.renderHoverCard && props.hoverCard(peekedItem)}
            </HoverCardSheet>
          )}
          <Command>
            <CommandInput
              onValueChange={props.onSearch}
              placeholder={t(props.placeholder)}
              className="h-9"
            />
            <HoverCardTrigger />

            <CommandGroup className="max-h-[200px] overflow-y-scroll">
              <AsyncComponent
                promise={props.fetchData}
                refreshTrigger={props.refreshTrigger}
                loaderElement={
                  <CommandLoading>{t("general.loading")}</CommandLoading>
                }
                errorElement={(error) => (
                  <CommandEmpty>
                    <span className="font-normal text-destructive">
                      Error: {error.message}
                    </span>
                  </CommandEmpty>
                )}
                component={(items) => {
                  const filteredItems = items.filter((ent) =>
                    props.filter ? props.filter(ent) : true,
                  );

                  return (
                    <>
                      {filteredItems.length === 0 &&
                        (props.emptyState ? (
                          props.emptyState
                        ) : (
                          <EmptyState
                            className="py-2"
                            size="small"
                            icon={SearchX}
                            title={noDataMessage}
                            description="empty_state.no_data_description"
                          />
                        ))}
                      {items
                        .filter((ent) =>
                          props.filter ? props.filter(ent) : true,
                        )
                        .map((item) => (
                          <CommandItem
                            key={props.searchValue(item)}
                            className="group relative"
                            value={props.searchValue(item)}
                            onMouseEnter={() => setPeekedItem(item)}
                            onSelect={() => {
                              log.click("Selected AsyncSelect item", {
                                item,
                                props,
                              });
                              props.onSelect(item);
                              setOpen(false);
                            }}
                          >
                            <div className="flex items-center justify-start gap-2 text-start">
                              {props.itemComponent(item)}
                              <p className="absolute inset-y-2.5 right-2 mt-0.5 text-xs text-muted-contrast opacity-0 group-aria-selected:opacity-100 ">
                                ↵
                              </p>
                            </div>
                          </CommandItem>
                        ))}
                    </>
                  );
                }}
              />
            </CommandGroup>
          </Command>
        </HoverCard>
      </PopoverContent>
    </Popover>
  );
}
