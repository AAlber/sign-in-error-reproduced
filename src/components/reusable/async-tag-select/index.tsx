import { Command as CommandPrimitive } from "cmdk";
import { t } from "i18next";
import { SearchX, X } from "lucide-react";
import type { KeyboardEvent as ReactKeyboardEvent, RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAsyncData } from "@/src/client-functions/client-utils/hooks";
import { log } from "@/src/utils/logger/logger";
import Skeleton from "../../skeleton";
import AsyncComponent from "../async-component";
import { EmptyState } from "../empty-state";
import { Button } from "../shadcn-ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "../shadcn-ui/command";

type AsyncTagSelectPropsBase<T> = {
  placeholder: string;
  placeholderWithTags: string;
  noDataMessage?: string; // Made optional
  onSearch?: (value: string) => void;
  refreshTrigger?: string;
  fetchData: () => Promise<T[]>;
  onSelect: (item: T) => void;
  searchValue: (item: T) => string;
  itemComponent: (item: T) => JSX.Element;
  filter?: (item: T) => boolean;
  emptyState?: React.ReactNode;
  onRemove: (item: T) => void;
  tagComponent: (item: T) => JSX.Element;
  tagsPromise: () => Promise<T[]>;
};

type TagInputProps<T> = {
  tags: T[];
  tagComponent: AsyncTagSelectPropsBase<T>["tagComponent"];
  handleUnselect: (value: T) => void;
  handleSearch: (e: string) => void;
  inputRef: RefObject<HTMLInputElement>;
  placeholder: string;
  placeholderWithTags: string;
  keyword: string;
  onBlur: () => void;
};

/**
 * AsyncTagSelect is a generic React component that renders a tag input with selection functionality.
 * It allows users to select an item from a list that is fetched asynchronously and renders the selection as tags.
 *
 * Type Parameters:
 * @template T The type of the items to be fetched and displayed.
 *
 * Props:
 * @param {AsyncTagSelectProps<T>} props The props for the AsyncTagSelect component.
 *
 * @param {string} props.placeholder Placeholder text for the command input.
 * @param {string} [props.noDataMessage="general.empty"] Message to display when there is no data.
 * @param {() => Promise<T[]>} props.fetchData Function to fetch the list of items asynchronously.
 * @param {(item: T) => void} props.onSelect Function to handle item selection.
 * @param {(item: T) => string} props.searchValue Function to determine the search value of an item.
 * @param {(item: T) => JSX.Element} props.itemComponent Component to render each item.
 * @param {(item: T) => boolean} [props.filter] Function to filter the items.
 * @param {boolean} [props.open] Controlled state of popover's open status.
 * @param {(item: T) => JSX.Element | null} [props.hoverCard] Function to render the hover card.
 *
 * @return {JSX.Element} The rendered AsyncTagSelect component.
 */

function AsyncTagSelect<T>({ ...props }: AsyncTagSelectPropsBase<T>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const commandContainerRef = useRef<HTMLDivElement>(null);
  const [tags, setTags] = useState<T[]>([]);
  const [keyword, setKeyword] = useState("");
  const [promiseLoading, setPromiseLoading] = useState(true);
  const { t } = useTranslation("page");
  const [open, setOpen] = useState(false);

  // Provide default values
  const noDataMessage = props.noDataMessage ?? "empty_state.no_data";

  const {
    data,
    loading: tagsLoading,
    error,
  } = useAsyncData(() => props.tagsPromise(), undefined);

  useEffect(() => {
    if (tagsLoading || error || !data) return;
    setTags(data);
  }, [data, tagsLoading, error]);

  const allLoadingFinished = !tagsLoading && !promiseLoading;

  const handleUnselect = (value: T) => {
    props.onRemove(value);
    setTags(tags.filter((s) => s !== value));
  };

  const handleSearch = (e: string) => {
    setOpen(true);
    setKeyword(e);
    if (props.onSearch) {
      props.onSearch(e);
    }
  };

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "" && tags.length > 0) {
          handleUnselect(tags[tags.length - 1]!);
          setOpen(false);
        }
      }
      // This is not a default behavior of the <input /> field
      if (e.key === "Escape") {
        input.blur();
      }
    }
  };

  return (
    <>
      <Command
        className="relative h-auto cursor-pointer overflow-visible bg-transparent"
        onKeyDown={handleKeyDown}
      >
        <div
          ref={commandContainerRef}
          onClick={() => {
            inputRef.current?.focus();
            setOpen(true);
          }}
          className="flex w-full cursor-pointer flex-wrap rounded-md border border-input bg-foreground ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
        >
          {!allLoadingFinished && <LoadingSkeleton />}

          {allLoadingFinished && (
            <TagInput
              tags={tags}
              tagComponent={props.tagComponent}
              handleSearch={handleSearch}
              handleUnselect={handleUnselect}
              inputRef={inputRef}
              placeholder={t(props.placeholder)}
              placeholderWithTags={t(props.placeholderWithTags)}
              keyword={keyword}
              onBlur={() => setTimeout(() => setOpen(false), 150)}
            />
          )}
        </div>

        {commandContainerRef && commandContainerRef.current && (
          <CommandGroup
            style={{
              top:
                commandContainerRef.current.getBoundingClientRect().height + 6,
            }}
            className={`absolute z-10 max-h-[200px] w-full cursor-pointer overflow-y-scroll rounded-md p-0 drop-shadow-md`}
          >
            <AsyncComponent
              promise={props.fetchData}
              refreshTrigger={props.refreshTrigger}
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
                setPromiseLoading(false);

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

                    {!open
                      ? []
                      : items
                          .filter((ent) =>
                            props.filter ? props.filter(ent) : true,
                          )
                          .map((item) => (
                            <CommandItem
                              key={props.searchValue(item)}
                              className="group relative cursor-pointer rounded-none bg-secondary px-3 py-2"
                              value={props.searchValue(item)}
                              onSelect={(e) => {
                                log.click("Selected AsyncTagSelect item", {
                                  item,
                                  props,
                                });
                                setKeyword("");
                                props.onSelect(item);
                                setTags([...tags, item]);
                                setOpen(false);
                                setTimeout(() => {
                                  commandContainerRef.current?.click();
                                }, 300);
                              }}
                            >
                              <div className="flex cursor-pointer items-center justify-start gap-2 text-start">
                                {props.itemComponent(item)}
                                <p className="absolute inset-y-2.5 right-2 mt-0.5 text-xs text-muted-contrast opacity-0 group-aria-selected:opacity-100">
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
        )}
      </Command>
    </>
  );
}

const TagInput = <T,>({
  tags,
  tagComponent,
  handleUnselect,
  handleSearch,
  inputRef,
  placeholder,
  placeholderWithTags,
  keyword,
  onBlur,
}: TagInputProps<T>) => {
  return (
    <div
      className={`flex w-full flex-wrap gap-2 ${
        tags.length > 0 ? "p-2" : ""
      } cursor-pointer`}
    >
      {tags.map((tag, index) => (
        <div
          key={index}
          className="flex h-[30px] cursor-pointer items-center rounded-md bg-secondary p-2 pr-1"
        >
          {tagComponent(tag)}
          <Button
            variant="ghost"
            size="iconSm"
            onClick={() => {
              handleUnselect(tag);
            }}
            className="cursor-pointer"
          >
            <X className="size-4" />
          </Button>
        </div>
      ))}
      <div className="flex w-[80px] grow cursor-pointer items-center">
        <CommandPrimitive.Input
          onValueChange={handleSearch}
          ref={inputRef}
          onBlur={onBlur}
          placeholder={
            tags.length > 0 ? t(placeholderWithTags) : t(placeholder)
          }
          className={`placeholder:text-muted-foreground h-[30px] w-full flex-1 border-none bg-transparent text-sm outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 ${
            tags.length > 0 ? "p-1" : "p-2"
          } cursor-pointer`}
          value={keyword}
        />
      </div>
    </div>
  );
};

const LoadingSkeleton = () => {
  return (
    <div
      className={`m-auto h-[30px] w-full grow cursor-pointer rounded-md p-2`}
    >
      <Skeleton />
    </div>
  );
};

export { AsyncTagSelect };
