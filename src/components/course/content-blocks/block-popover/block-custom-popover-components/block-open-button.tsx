import { useState } from "react";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import type { ContentBlock } from "@/src/types/course.types";

type BlockOpenButtonProps = {
  title: string;
  block: ContentBlock;
};

export default function BlockOpenButton({
  block,
  title,
}: BlockOpenButtonProps) {
  const [opening, setOpening] = useState(false);
  const { t } = useTranslation("page");

  return (
    <Button
      variant={"cta"}
      className="w-full"
      disabled={opening}
      onClick={async () => {
        setOpening(true);
        await contentBlockHandler.zustand.open(block.id);
        setOpening(false);
      }}
    >
      {opening ? t("general.loading") : t(title)}
    </Button>
  );
}
