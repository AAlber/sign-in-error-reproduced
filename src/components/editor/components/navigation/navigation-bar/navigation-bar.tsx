import { useState } from "react";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import useContentBlockOverview from "@/src/components/course/content-blocks/block-overview/zustand";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import type { EditorFileSpecs } from "@/src/types/content-block/types/specs.types";
import useContentBlockCreator from "../../../../course/content-blocks/content-block-creator/zustand";
import type { EditorData } from "../../../types";
import { useEditor } from "../../../zustand";

export default function NavigationBar() {
  const { t } = useTranslation("page");
  const { data, setOpen, canCreate, originBlockId } = useEditor();
  const { openModal, setData } = useContentBlockCreator();
  const { openOverview } = useContentBlockOverview();
  const [loading, setLoading] = useState(false);

  if (!canCreate) return null;

  return (
    <div>
      <Button
        size={"small"}
        variant={"cta"}
        onClick={async () => {
          setOpen(false);
          const pagesWithoutThumbnails = data.pages.map((page) => {
            const { thumbnail, ...rest } = page;
            return rest;
          });

          const cbData: EditorFileSpecs = {
            content: JSON.stringify({
              pages: pagesWithoutThumbnails,
            } satisfies EditorData),
          };

          const blocks = contentBlockHandler.zustand.getContentBlocks();
          const block = blocks.find((block) => block.id === originBlockId);

          if (block) {
            setLoading(true);
            contentBlockHandler.update.block({
              id: block.id,
              status: "DRAFT",
              specs: cbData,
            });
            setLoading(false);
            return openOverview(block);
          } else {
            openModal("EditorFile");
            setData<"EditorFile">(cbData satisfies EditorFileSpecs);
          }
        }}
      >
        {t(loading ? "general.loading" : "general.save")}
      </Button>
    </div>
  );
}
