import clsx from "clsx";
import {
  BoldIcon,
  CodeIcon,
  IndentIcon,
  ItalicIcon,
  List,
  ListOrderedIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from "lucide-react";
import React from "react";
import { Editor, Element as SlateElement, Transforms } from "slate";
import {
  type RenderElementProps,
  type RenderLeafProps,
  useSlate,
} from "slate-react";
import { isUrl } from "@/src/client-functions/client-utils";
import { log } from "@/src/utils/logger/logger";
import {
  toolbar,
  toolsIcon,
  toolsIconActive,
  toolsIconContainerStyle,
} from "./styles";
import type {
  BlockFormatting,
  CustomEditor,
  CustomElement,
  CustomElementTypes,
  FormattedText,
  MarkFormatting,
  OrNull,
} from "./types";

export interface BaseProps {
  className?: string;
  [key: string]: unknown;
}

export const Element = (props: RenderElementProps) => {
  const element = renderElementNode(props);
  if (typeof element === "string") return props.children;
  return element;
};

export const renderElementNode = (
  props: RenderElementProps & { isString?: boolean },
) => {
  const { element, attributes, children, isString } = props;

  /**
   * when isString is true, the return value is of type string which
   * is then used to send along with getstream message payload
   */

  switch (element.type) {
    case "block-quote":
      return isString ? (
        `<blockquote class="chat--blockquote">${children}</blockquote>`
      ) : (
        <blockquote
          className="ml-4 flex border-l-[3px] border-border pl-2 "
          {...attributes}
        >
          {children}
        </blockquote>
      );
    case "bulleted-list":
      return isString ? (
        `<ul class="chat--ul" >${children}</ul>`
      ) : (
        <ul className="ml-2 list-disc pl-2" {...attributes}>
          {children}
        </ul>
      );
    case "list-item":
      return isString ? (
        `<li class="chat--list-item">${children}</li>`
      ) : (
        <li className="ml-2 pl-2" {...attributes}>
          {children}
        </li>
      );
    case "numbered-list":
      return isString ? (
        `<ol class="chat--numbered-list">${children}</ol>`
      ) : (
        <ol className="list-decimal pl-4" {...attributes}>
          {children}
        </ol>
      );
    case "heading-one":
      return isString ? (
        `<h1 class="text-3xl">${children}</h1>`
      ) : (
        <h1 className="text-3xl" {...attributes}>
          {children}
        </h1>
      );
    case "heading-two":
      return isString ? (
        `<h2 class="text-lg">${children}</h2>`
      ) : (
        <h2 className="text-lg" {...attributes}>
          {children}
        </h2>
      );
    case "link":
      const is_url = isUrl(element.href);

      if (!is_url) {
        return isString ? `<span>${children}</span>` : <span>{children}</span>;
      }

      return isString ? (
        `<a class="chat--link-attachment" href="${element.href}" target="_blank" rel="noreferrer">${children}</a>`
      ) : (
        <a
          className="border border-border text-primary underline"
          href={element.href}
        >
          <InlineChromiumBugfix />
          {children}
          <InlineChromiumBugfix />
        </a>
      );
    case "emoji":
      if (isString) {
        const hasTexts =
          /[0-9a-zA-Z `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g.test(children);

        return `<span style="font-size: ${element.fontSize}; ${
          !hasTexts ? "margin-top: 8px; display: inline-block;" : ""
        }">${children}</span>`;
      } else {
        return (
          <span
            style={{
              fontSize: element.fontSize,
            }}
          >
            <InlineChromiumBugfix />
            {children}
            <InlineChromiumBugfix />
          </span>
        );
      }
    default:
      return isString ? (
        `<p>${children}</p>`
      ) : (
        <p {...attributes}>{children}</p>
      );
  }
};

export const renderLeafNode = (
  leaf: FormattedText,
  children: React.ReactNode,
  toString = false,
) => {
  if (leaf.bold) {
    children = toString ? (
      `<strong>${children}</strong>`
    ) : (
      <strong>{children}</strong>
    );
  }

  if (leaf.code) {
    children = toString ? (
      `<code class="rounded-md border-l mt-1 inline-block border border-border bg-secondary p-1 !font-mono text-primary "
      >${children}</code>`
    ) : (
      <code
        className="mt-1 inline-block rounded-md border border-border bg-secondary p-1 !font-mono text-primary"
        style={{
          fontFamily: "monospace !important",
        }}
      >
        {children}
      </code>
    );
  }

  if (leaf.italic) {
    children = toString ? `<em>${children}</em>` : <em>{children}</em>;
  }

  if (leaf.underline) {
    children = toString ? `<u>${children}</u>` : <u>{children}</u>;
  }

  if (leaf.strikethrough) {
    children = toString ? `<s>${children}</s>` : <s>{children}</s>;
  }

  return children;
};

export const Leaf: React.FC<RenderLeafProps> = (props) => {
  const { leaf, children: ch, attributes } = props;
  const children = renderLeafNode(leaf, ch);
  return <span {...attributes}>{children}</span>;
};

export const Button = React.forwardRef<
  OrNull<HTMLSpanElement>,
  {
    active: boolean;
    reversed: boolean;
    format: MarkFormatting | BlockFormatting;
  } & BaseProps
>((props, ref) => {
  const { active, className, format, ...rest } = props;

  const renderIcon = () => {
    switch (format) {
      case "bold": {
        return <BoldIcon size={16} />;
      }
      case "italic": {
        return <ItalicIcon size={16} />;
      }
      case "code": {
        return <CodeIcon size={16} />;
      }
      case "underline": {
        return <UnderlineIcon size={16} />;
      }
      case "strikethrough": {
        return <StrikethroughIcon size={16} />;
      }
      case "block-quote": {
        return <IndentIcon size={16} />;
      }
      case "numbered-list": {
        return <ListOrderedIcon size={16} />;
      }
      case "bulleted-list": {
        return <List size={16} />;
      }
      default: {
        return null;
      }
    }
  };

  return (
    <span
      {...rest}
      ref={ref}
      className={clsx(
        toolsIconContainerStyle,
        toolbar,
        active ? toolsIconActive : toolsIcon,
        className,
      )}
    >
      {renderIcon()}
    </span>
  );
});

Button.displayName = "SlateButton";

/** MARKS */

export const toggleMark = (editor: CustomEditor, format: MarkFormatting) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

export const isMarkActive = (editor: CustomEditor, format: MarkFormatting) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

export const MarkButton: React.FC<{ format: MarkFormatting }> = (props) => {
  const editor = useSlate();
  const { format } = props;
  const isActive = isMarkActive(editor, format);

  return (
    <Button
      active={isActive}
      onMouseDown={(event) => {
        log.click("Format: " + format);
        event.preventDefault();
        toggleMark(editor, format);
      }}
      format={format}
    />
  );
};

/** BLOCKS */

const LIST_TYPES = ["numbered-list", "bulleted-list"];
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];

export const toggleBlock = (editor: CustomEditor, format: BlockFormatting) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? "align" : "type",
  );
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  });

  const newProperties: Partial<SlateElement> = TEXT_ALIGN_TYPES.includes(format)
    ? {}
    : {
        type: isActive
          ? "paragraph"
          : isList
          ? "list-item"
          : (format as CustomElementTypes),
      };

  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = {
      type: format as CustomElement["type"],
      children: [],
    };

    Transforms.wrapNodes(editor, block as CustomElement);
  }
};

export const isBlockActive = (
  editor: CustomEditor,
  format: BlockFormatting,
  blockType: "align" | "type" = "type",
) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType] === format,
    }),
  );

  return !!match;
};

export const BlockButton: React.FC<{ format: BlockFormatting }> = (props) => {
  const { format } = props;
  const editor = useSlate();
  return (
    <Button
      active={isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? "align" : "type",
      )}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
      format={format}
    />
  );
};

export const renderLeaf = (props: RenderLeafProps) => <Leaf {...props} />;
export const renderElement = (props: RenderElementProps) => (
  <Element {...props} />
);

const InlineChromiumBugfix = () => (
  <span contentEditable={false} style={{ fontSize: "0px" }}>
    ${String.fromCodePoint(160) /* Non-breaking space */}
  </span>
);
