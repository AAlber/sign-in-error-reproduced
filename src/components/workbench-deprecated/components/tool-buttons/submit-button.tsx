import { useState } from "react";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import { requireStatementOfIndependenceIfEnabledOrProceed } from "@/src/client-functions/client-utils";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import useWorkbench from "../../zustand";

export default function SubmitButton() {
  const { blockId, setOpen, content } = useWorkbench();
  const { t } = useTranslation("page");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    requireStatementOfIndependenceIfEnabledOrProceed(async () => {
      setLoading(true);
      const stringifiedContent = JSON.stringify(content, null, 2);

      await contentBlockHandler.userStatus.finish<"Assessment">(blockId, {
        content: stringifiedContent,
        lastEditedAt: new Date(),
      });

      setLoading(false);
      setOpen(false);
    });
  };

  return (
    <Button disabled={loading} variant={"cta"} onClick={onSubmit}>
      {t(loading ? "general.loading" : "workbench_header_submit_button")}
    </Button>
  );
}
