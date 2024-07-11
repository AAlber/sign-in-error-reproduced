import type { Editor as CoreEditor } from "@tiptap/core";
import type { TableOfContentStorage } from "@tiptap-pro/extension-table-of-content";
import { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import classNames from "@/src/client-functions/client-utils";

export type Props = {
  editor: CoreEditor;
  onItemClick?: () => void;
};

export const TableOfContent = memo(({ editor, onItemClick }: Props) => {
  const [data, setData] = useState<TableOfContentStorage | null>(null);

  const { t } = useTranslation("page");

  useEffect(() => {
    const handler = ({ editor: currentEditor }: { editor: CoreEditor }) => {
      setData({ ...currentEditor.extensionStorage.tableOfContent });
    };

    handler({ editor });

    editor.on("update", handler);
    editor.on("selectionUpdate", handler);

    return () => {
      editor.off("update", handler);
      editor.off("selectionUpdate", handler);
    };
  }, [editor]);

  return (
    <>
      <div className="mb-2 text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400">
        {t("editor.table-of-contents-heading")}
      </div>
      {data && data.content.length > 0 ? (
        <div className="flex flex-col gap-1">
          {data.content.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              style={{ marginLeft: `${1 * item.level - 1}rem` }}
              onClick={onItemClick}
              className={classNames(
                "block w-full truncate rounded bg-opacity-10 p-1 text-sm font-medium text-neutral-500 transition-all hover:bg-black hover:bg-opacity-5 hover:text-neutral-800 dark:text-neutral-300",
                item.isActive &&
                  "bg-neutral-100 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-100",
              )}
            >
              {item.itemIndex}. {item.textContent}
            </a>
          ))}
        </div>
      ) : (
        <div className="text-sm text-neutral-500">
          {t("editor.table-of-contents-placeholder")}
        </div>
      )}
    </>
  );
});

TableOfContent.displayName = "TableOfContents";