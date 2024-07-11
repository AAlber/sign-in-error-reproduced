import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import type { ContentBlock } from "@/src/types/course.types";
import ScrollableItemSelector from "../../reusable/scrollable-item-selector";
import useImportCourseDataModal from "./zustand";

export default function DataToImportSelector() {
  const { t } = useTranslation("page");
  const {
    layerToImportFromId,
    selectedContentBlockIds,
    setSelectedContentBlockIds,
  } = useImportCourseDataModal();
  const [loading, setLoading] = useState(false);
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);

  useEffect(() => {
    if (!layerToImportFromId) return;
    setLoading(true);
    contentBlockHandler.get
      .allBlocksOfLayer(layerToImportFromId)
      .then((blocks) => {
        setContentBlocks(blocks);
        setSelectedContentBlockIds(blocks.map((block) => block.id));
        setLoading(false);
      });
  }, [layerToImportFromId]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        {t("content")}
        {selectedContentBlockIds.length === contentBlocks.length && (
          <button
            onClick={() => setSelectedContentBlockIds([])}
            className="text-sm text-muted-contrast underline hover:opacity-80"
          >
            {t("deselect-all")}
          </button>
        )}
        {selectedContentBlockIds.length < contentBlocks.length && (
          <button
            onClick={() =>
              setSelectedContentBlockIds(contentBlocks.map((block) => block.id))
            }
            className="text-sm text-muted-contrast  underline hover:opacity-80"
          >
            {t("select-all")}
          </button>
        )}
      </div>
      <ScrollableItemSelector<ContentBlock>
        items={contentBlocks}
        loading={loading}
        selected={contentBlocks.filter((block) =>
          selectedContentBlockIds.includes(block.id),
        )}
        setSelected={(selected) =>
          setSelectedContentBlockIds(selected.map((block) => block.id))
        }
        itemRenderer={(item) => {
          const blockType =
            contentBlockHandler.get.registeredContentBlockByType(item.type);
          if (!blockType) return <></>;
          return (
            <p className="t-primary flex h-8 items-center gap-2 text-sm">
              <span>{blockType.style.icon}</span>
              <span>{item.name}</span>
            </p>
          );
        }}
      />
    </div>
  );
}
