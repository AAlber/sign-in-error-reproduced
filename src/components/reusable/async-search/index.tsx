import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAsyncData } from "@/src/client-functions/client-utils/hooks";
import Spinner from "../../spinner";
import { Button } from "../shadcn-ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
} from "../shadcn-ui/command";
import { HoverCard, HoverCardSheet } from "../shadcn-ui/hover-card";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn-ui/popover";

type AsyncSearchProps<T> =
  | AsyncSearchPropsWithoutHoverCard<T>
  | AsyncSearchPropsWithHoverCard<T>;

type AsyncSearchPropsBase<T> = {
  trigger?: JSX.Element;
  openWithShortcut?: boolean; // Made optional
  placeholder: string;
  noDataMessage?: string; // Made optional
  side?: "left" | "right" | "top" | "bottom";
  totalPages: number;
  onSearch?: (value: string) => void;
  refreshTrigger?: string;
  fetchData: (value: string, page: number) => Promise<T[]>;
  onSelect: (item: T) => void;
  searchValue: (item: T) => string;
  itemComponent: (item: T) => JSX.Element;
  filter?: (item: T) => boolean;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  initialValues?: T[];
  initialValuesLoading?: boolean;
  initialValuesEmptyState: () => JSX.Element;
};

type AsyncSearchPropsWithoutHoverCard<T> = AsyncSearchPropsBase<T> & {
  renderHoverCard?: false; // Made optional
};

type AsyncSearchPropsWithHoverCard<T> = AsyncSearchPropsBase<T> & {
  renderHoverCard?: true; // Made optional
  hoverCard: (item: T) => JSX.Element | null;
};

/**
 * AsyncSearch is a generic React component that renders a popover with an AsyncSelect functionality / style.
 * It allows users to select an item from a dynamically loaded list, which is updated in real-time
 * based on their input.
 * AsyncSearch also supports pagination.
 *
 * Type Parameters:
 * @template T The type of the items to be fetched and displayed.
 *
 * Props:
 * @param {AsyncSearchProps<T>} props The props for the AsyncSearch component.
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
 * @return {JSX.Element} The rendered AsyncSearch component.
 */

export const AsyncSearch = <T,>({ ...props }: AsyncSearchProps<T>) => {
  const [nativeOpen, setNativeOpen] = useState(false);
  const [peekedItem, setPeekedItem] = useState<T | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [items, setItems] = useState<T[]>([]);
  const [nextPageLoading, setNextPageLoading] = useState(false);

  const { t } = useTranslation("page");

  const open = props.open ?? nativeOpen;
  const setOpen = props.setOpen ?? setNativeOpen;

  // Provide default values
  const openWithShortcut = props.openWithShortcut ?? false;
  const noDataMessage = props.noDataMessage ?? "general.empty";
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
  }, [openWithShortcut, setOpen]);

  const fetchData = async (page: number): Promise<T[]> => {
    if (searchTerm) {
      try {
        if (page > 1) setNextPageLoading(true);
        const data = await props.fetchData(searchTerm, page);
        setItems([...items, ...data]);
        setCurrentPage(page);
        return data;
      } catch (error) {
        return [];
      } finally {
        setNextPageLoading(false);
      }
    }
    return [];
  };

  const { data, loading: initialLoading } = useAsyncData(
    async () => {
      setCurrentPage(1);
      if (searchTerm.length > 0) {
        const m = await fetchData(1);
        setItems(m);
        return m;
      } else {
        if (props.initialValues) {
          setItems(props.initialValues);
        }
      }
    },
    JSON.stringify([searchTerm, props.initialValues]),
    300,
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="cursor-pointer">
        {props.trigger}
      </PopoverTrigger>
      <PopoverContent
        side={props.side || "left"}
        className="ml-5 mt-2 w-[300px] p-0"
      >
        <HoverCard>
          {peekedItem && renderHoverCard && (
            <HoverCardSheet
              side="left"
              align="start"
              forceMount
              className="w-[250px] bg-background"
            >
              {props.renderHoverCard && props.hoverCard(peekedItem)}
            </HoverCardSheet>
          )}
          <Command>
            <CommandInput
              value={searchTerm}
              onValueChange={(value) => setSearchTerm(value)}
              placeholder={t(props.placeholder)}
              className="h-9"
            />
            {(initialLoading || props.initialValuesLoading) && (
              <CommandLoading>{t("general.loading")}</CommandLoading>
            )}
            <CommandList>
              {/*
                CommandEmpty doesn't work properly with the
                conditionally rendered CommandLoading component.
                So we used the paragraph below, instead of CommandEmpty.
                */}
              {!initialLoading && data && items.length === 0 && (
                // Mimics CommandEmpty
                <p className="py-6 text-center text-sm">{t(noDataMessage)}</p>
              )}

              {!searchTerm &&
                !props.initialValuesLoading &&
                props.initialValues?.length === 0 && (
                  <div className="pt-2">{props.initialValuesEmptyState()}</div>
                )}

              <CommandGroup className="max-h-[200px] overflow-y-scroll">
                {!searchTerm &&
                  !props.initialValuesLoading &&
                  items.map((item) => (
                    <CommandItem
                      key={props.searchValue(item)}
                      className="group relative"
                      value={props.searchValue(item)}
                      onMouseEnter={() => setPeekedItem(item)}
                      onSelect={() => {
                        props.onSelect(item);
                        setOpen(false);
                      }}
                    >
                      <div className="flex items-center justify-start gap-2 text-start">
                        {props.itemComponent(item)}
                        <p className="absolute inset-y-2.5 right-2 mt-0.5 text-xs text-muted-contrast opacity-0 group-aria-selected:opacity-100">
                          ↵
                        </p>
                      </div>
                    </CommandItem>
                  ))}
                {!initialLoading &&
                  data &&
                  items
                    .filter((ent) => (props.filter ? props.filter(ent) : true))
                    .map((item, ix, filteredItems) => (
                      <div key={props.searchValue(item)}>
                        <CommandItem
                          className="group relative"
                          value={props.searchValue(item)}
                          onMouseEnter={() => setPeekedItem(item)}
                          onSelect={() => {
                            props.onSelect(item);
                            setOpen(false);
                          }}
                        >
                          <div className="flex items-center justify-start gap-2 text-start">
                            {props.itemComponent(item)}
                            <p className="absolute inset-y-2.5 right-2 mt-0.5 text-xs text-muted-contrast opacity-0 group-aria-selected:opacity-100">
                              ↵
                            </p>
                          </div>
                        </CommandItem>
                        {ix === filteredItems.length - 1 &&
                          currentPage < props.totalPages && (
                            <div className="flex p-2">
                              <Button
                                disabled={nextPageLoading}
                                onClick={() => fetchData(currentPage + 1)}
                                variant="link"
                                className="w-[calc(100%-16px)]"
                              >
                                {nextPageLoading ? (
                                  <Spinner size="w-4 h-4" />
                                ) : (
                                  <>
                                    {t(
                                      "course_members_display_members_search_load_more",
                                    )}
                                  </>
                                )}
                              </Button>
                            </div>
                          )}
                      </div>
                    ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </HoverCard>
      </PopoverContent>
    </Popover>
  );
};
