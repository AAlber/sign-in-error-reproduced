import { useState } from "react";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import useWorkbench from "../../zustand";

export default function SaveProcess() {
  const { setOpen, content, blockId } = useWorkbench();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("page");

  return (
    <>
      {
        <Button
          variant={"cta"}
          onClick={async () => {
            setLoading(true);
            const stringifiedContent = JSON.stringify(content, null, 2);
            await contentBlockHandler.userStatus.update<"StaticWorkbenchFile">({
              blockId,
              data: {
                status: "FINISHED",
                userData: {
                  content: stringifiedContent,
                  lastViewedAt: new Date(),
                },
              },
            });
            setLoading(false);
            setOpen(false);
          }}
        >
          {t(loading ? "general.loading" : "general.save")}
        </Button>
      }
    </>
  );
}
