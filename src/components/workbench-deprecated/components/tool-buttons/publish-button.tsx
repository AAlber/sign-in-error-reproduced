import { useState } from "react";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import confirmAction from "@/src/client-functions/client-options-modal";
import useContentBlockOverview from "@/src/components/course/content-blocks/block-overview/zustand";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import useWorkbench from "../../zustand";

export default function PublishButton() {
  const { setOpen, blockId, selectedUser, content } = useWorkbench();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { t } = useTranslation("page");
  const { refreshOverview } = useContentBlockOverview();

  return (
    <div className="flex items-center gap-2">
      <Button
        disabled={saving}
        onClick={async () => {
          if (!selectedUser) return;
          setSaving(true);
          await contentBlockHandler.userStatus.update<"Assessment">({
            blockId,
            userId: selectedUser.id,
            data: {
              status: "FINISHED",
              userData: {
                content: JSON.stringify(content),
                lastEditedAt: new Date(),
              },
            },
          });

          setSaving(false);
          setOpen(false);
          refreshOverview();
        }}
      >
        {t(saving ? "general.loading" : "general.save")}
      </Button>

      <Button
        disabled={loading}
        onClick={async () => {
          confirmAction(
            async () => {
              if (!selectedUser) return;
              setLoading(true);
              await contentBlockHandler.userStatus.update<"Assessment">({
                blockId,
                userId: selectedUser.id,
                data: {
                  status: "REVIEWED",
                  userData: {
                    content: JSON.stringify(content),
                    lastEditedAt: new Date(),
                  },
                },
              });
              setLoading(false);
              setOpen(false);
              refreshOverview();
            },
            {
              title: "workbench.publish_result",
              description: "workbench.publish_result_description",
              actionName: "workbench.confirm_action_publish_action",
            },
          );
        }}
        variant={"cta"}
      >
        {t(
          loading ? "general.loading" : "workbench_header_share_result_button",
        )}
      </Button>
    </div>
  );
}
