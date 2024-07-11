import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import type { ContentBlock } from "@/src/types/course.types";
import { SharedHandInModal } from "./shared-handin";

export const SharedHandInTrigger = ({ block }: { block: ContentBlock }) => {
  const { t } = useTranslation("page");
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button className="w-full" onClick={() => setOpen(true)}>
        {t("shared-handins")}
      </Button>
      <SharedHandInModal block={block} open={open} setOpen={setOpen} />
    </>
  );
};
