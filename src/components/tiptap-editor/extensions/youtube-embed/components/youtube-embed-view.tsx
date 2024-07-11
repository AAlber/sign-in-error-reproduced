import type { Editor } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Input from "@/src/components/reusable/input";
import { Button } from "@/src/components/reusable/shadcn-ui/button";

export const YoutubeEmbedView = ({
  getPos,
  editor,
}: {
  getPos: () => number;
  editor: Editor;
}) => {
  const [url, setUrl] = useState<string>("");
  const { t } = useTranslation("page");

  const isValidUrl = useMemo(() => /^(\S+):(\/\/)?\S+$/.test(url), [url]);

  const handleSubmit = useCallback(() => {
    if (isValidUrl) {
      editor
        .chain()
        .setYoutubeVideo({ src: url })
        .deleteRange({ from: getPos(), to: getPos() })
        .focus()
        .run();
    }
  }, [getPos, editor, isValidUrl, url]);

  return (
    <NodeViewWrapper>
      <div className="m-0 p-0" data-drag-handle>
        <div className="flex gap-x-2">
          <Input
            text={url}
            setText={setUrl}
            placeholder={t("editor.youtube-url-placeholder")}
          />
          <Button
            disabled={!isValidUrl}
            className="min-w-max"
            onClick={handleSubmit}
          >
            {t("embed video")}
          </Button>
        </div>
      </div>
    </NodeViewWrapper>
  );
};
