import { useState } from "react";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import WithToolTip from "@/src/components/reusable/with-tooltip";
import type { ContentBlock } from "@/src/types/course.types";

type BlockMarkAsFinishedButtonProps = {
  block: ContentBlock;
  onFinish?: () => void;
};

export default function BlockMarkAsFinishedButton({
  block,
  onFinish,
}: BlockMarkAsFinishedButtonProps) {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("page");

  const hasOpenedOnce = block.userStatus === "IN_PROGRESS";

  return (
    <WithToolTip text="file_opened_once" disabled={hasOpenedOnce}>
      <Button
        className="w-full"
        disabled={loading || !hasOpenedOnce}
        onClick={async () => {
          setLoading(true);
          onFinish?.();
          await contentBlockHandler.userStatus.finish(block.id);
          setLoading(false);
        }}
      >
        {loading ? t("general.loading") : t("content-block.mark_as_finished")}
      </Button>
    </WithToolTip>
  );
}
