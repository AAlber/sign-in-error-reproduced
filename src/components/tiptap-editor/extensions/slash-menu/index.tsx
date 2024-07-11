import type { Editor, Range } from "@tiptap/core";
import { Extension } from "@tiptap/core";
import { ReactRenderer } from "@tiptap/react";
import type {
  SuggestionKeyDownProps,
  SuggestionOptions,
  SuggestionProps,
} from "@tiptap/suggestion";
import Suggestion from "@tiptap/suggestion";
import tippy from "tippy.js";
import elementRegistryHandler from "../../../editor/components/element-library/handler";
import { CommandList } from "./command-list";

type CommandOptions = {
  removeCommands?: string[];
};

type CommandItems = (props: {
  query: string;
  editor: Editor;
  removeCommands: CommandOptions["removeCommands"];
}) => any[] | Promise<any[]>;

const getCommandItems: CommandItems = ({ query, removeCommands }) => {
  const groupedElements = elementRegistryHandler
    .getSlashCommandCategories()
    .map((category) => {
      return {
        title: category.name,
        elements: elementRegistryHandler
          .getRegisteredElements()
          .filter(
            (element) =>
              element.onSlashCommand &&
              !removeCommands?.includes(element.name) &&
              element.slashCommandCategory?.name === category.name,
          )
          .map((element) => {
            return {
              title: element.name,
              description: element.description,
              searchTerms: element.searchTerms,
              icon: <element.icon className="h-5 w-5" />,
              command: ({ editor, range }) =>
                element.onSlashCommand!({ editor, range }),
            };
          }),
      };
    });

  const filteredElement = groupedElements.map((group) => ({
    ...group,
    elements: group.elements.filter((item) => {
      if (typeof query === "string" && query.length > 0) {
        const search = query.toLowerCase();
        return (
          item.title.toLowerCase().includes(search) ||
          item.description.toLowerCase().includes(search) ||
          (item.searchTerms &&
            item.searchTerms.some((term: string) => term.includes(search)))
        );
      }
      return true;
    }),
  }));

  const withoutEmptyElements = filteredElement.filter((group) => {
    if (group.elements.length > 0) {
      return true;
    }

    return false;
  });

  return withoutEmptyElements;
};

export const updateScrollView = (container: HTMLElement, item: HTMLElement) => {
  const containerHeight = container.offsetHeight;
  const itemHeight = item ? item.offsetHeight : 0;

  const top = item.offsetTop;
  const bottom = top + itemHeight;

  if (top < container.scrollTop) {
    container.scrollTop -= container.scrollTop - top + 5;
  } else if (bottom > containerHeight + container.scrollTop) {
    container.scrollTop += bottom - containerHeight - container.scrollTop + 5;
  }
};

const renderItems: SuggestionOptions["render"] = () => {
  let component: ReactRenderer | null = null;
  let popup: any | null = null;

  return {
    onStart: (props: SuggestionProps) => {
      component = new ReactRenderer(CommandList, {
        props,
        editor: props.editor,
      });

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      popup = tippy("body", {
        getReferenceClientRect: props.clientRect,
        appendTo: () => document.body,
        content: component.element,
        showOnCreate: true,
        interactive: true,
        trigger: "manual",
        placement: "bottom-start",
      });
    },
    onUpdate: (props: SuggestionProps) => {
      component?.updateProps(props);

      popup &&
        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
    },
    onKeyDown: (props: SuggestionKeyDownProps) => {
      if (props.event.key === "Escape") {
        popup?.[0].hide();

        return true;
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return component?.ref?.onKeyDown(props);
    },
    onExit: () => {
      popup?.[0].destroy();
      component?.destroy();
    },
  };
};

const SlashCommand = Extension.create<CommandOptions>({
  name: "slash-command",
  addProseMirrorPlugins() {
    return [
      Suggestion({
        allowSpaces: true,
        startOfLine: true,
        editor: this.editor,
        char: "/",
        items: ({ query, editor }) =>
          getCommandItems({
            query,
            editor,
            removeCommands: this.options.removeCommands,
          }),
        render: renderItems,
        command: ({
          editor,
          range,
          props,
        }: {
          editor: Editor;
          range: Range;
          props: any;
        }) => {
          props.command({ editor, range });
        },
      }),
    ];
  },
});

export default SlashCommand;
