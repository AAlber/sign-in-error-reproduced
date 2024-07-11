import type { SuggestionKeyDownProps } from "@tiptap/suggestion";
import type { ReactNode } from "react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { updateScrollView } from ".";

interface CommandItemProps {
  title: string;
  elements: {
    description: string;
    icon: ReactNode;
    category: string;
  }[];
}

interface Props {
  items: CommandItemProps[];
  command: any;
  editor: any;
  range: any;
}

export const CommandList = forwardRef(
  ({ items, command, editor, range }: Props, ref) => {
    const { t } = useTranslation("page");
    const [selectedCategoryIndex, setSelectedCategoryIndex] =
      useState<number>(0);
    const [selectedCategoryElementsIndex, setSelectedCategoryElementsIndex] =
      useState<number>(0);

    const commandListContainer = useRef<HTMLDivElement>(null);

    const selectItem = useCallback(
      (categoryIndex: number, itemIndex) => {
        const item = items[categoryIndex]?.elements[itemIndex];
        if (item) {
          command(item);
        }
      },
      [command, editor, items],
    );

    const navigationKeys = ["ArrowUp", "ArrowDown", "Enter"];

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: SuggestionKeyDownProps) => {
        if (navigationKeys.includes(event.key)) {
          if (event.key === "ArrowUp") {
            let newCategoryItemIndex = selectedCategoryElementsIndex - 1;
            let newCategoryIndex = selectedCategoryIndex;

            if (newCategoryItemIndex < 0) {
              newCategoryIndex = selectedCategoryIndex - 1;
              const categoryItems = items[newCategoryIndex]?.elements;
              newCategoryItemIndex = categoryItems
                ? categoryItems.length - 1
                : 0;
            }

            if (newCategoryIndex < 0) {
              newCategoryIndex = items.length - 1;
              const categoryItems = items[newCategoryIndex]?.elements;
              newCategoryItemIndex = categoryItems
                ? categoryItems.length - 1
                : 0;
            }

            setSelectedCategoryElementsIndex(newCategoryItemIndex);
            setSelectedCategoryIndex(newCategoryIndex);

            return true;
          }

          if (event.key === "ArrowDown") {
            const categoryItems = items[selectedCategoryIndex]?.elements;

            if (!categoryItems) return false;

            let newCategoryItemIndex = selectedCategoryElementsIndex + 1;
            let newCategoryIndex = selectedCategoryIndex;

            if (categoryItems.length - 1 < newCategoryItemIndex) {
              newCategoryItemIndex = 0;
              newCategoryIndex = selectedCategoryIndex + 1;
            }

            if (items.length - 1 < newCategoryIndex) {
              newCategoryIndex = 0;
            }

            setSelectedCategoryElementsIndex(newCategoryItemIndex);
            setSelectedCategoryIndex(newCategoryIndex);

            return true;
          }
          if (event.key === "Enter") {
            selectItem(selectedCategoryIndex, selectedCategoryElementsIndex);
            return true;
          }
          return false;
        }
      },
    }));

    useEffect(() => {
      setSelectedCategoryIndex(0);
      setSelectedCategoryElementsIndex(0);
    }, [items]);

    useLayoutEffect(() => {
      const container = commandListContainer?.current;

      const item = container?.children[selectedCategoryIndex]?.children[
        selectedCategoryElementsIndex + 1
      ] as HTMLElement;

      if (item && container) updateScrollView(container, item);
    }, [selectedCategoryIndex, selectedCategoryElementsIndex]);

    return items.length > 0 ? (
      <div
        id="slash-command"
        ref={commandListContainer}
        className="z-[9999] flex h-auto max-h-[300px] w-72 flex-col gap-y-4 overflow-y-scroll rounded-md border border-border bg-card px-1 py-2 shadow-md"
      >
        {items.map((item: CommandItemProps, categoryIdx: number) => {
          return (
            <div className="flex flex-col gap-y-1" key={item.title}>
              <p className="ml-2.5 text-xs uppercase text-muted-contrast">
                {t(item.title)}
              </p>
              {item.elements.map((item: any, itemIdx: number) => {
                return (
                  <Button
                    variant={"ghost"}
                    className={`flex h-auto w-full items-center justify-start space-x-2 rounded-md px-2 py-1 text-left text-sm font-normal
                                  ${
                                    categoryIdx === selectedCategoryIndex &&
                                    itemIdx === selectedCategoryElementsIndex &&
                                    "bg-accent/50"
                                  }`}
                    key={itemIdx}
                    onClick={() => selectItem(categoryIdx, itemIdx)}
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm text-contrast">{t(item.title)}</p>
                      <p className="text-xs text-muted-contrast">
                        {t(item.description)}
                      </p>
                    </div>
                  </Button>
                );
              })}
            </div>
          );
        })}
      </div>
    ) : null;
  },
);

CommandList.displayName = "CommandList";
