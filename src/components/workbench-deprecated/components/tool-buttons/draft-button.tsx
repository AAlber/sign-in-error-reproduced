import { useState } from "react";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import useUser from "../../../../zustand/user";
import useCourse from "../../../course/zustand";
import useWorkbench from "../../zustand";

export default function SaveAsDraft() {
  const { content, setOpen, blockId } = useWorkbench();
  const { user: user } = useUser();
  const { refreshCourse } = useCourse();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("page");

  return (
    <Button
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        const stringifiedContent = JSON.stringify(content, null, 2);
        contentBlockHandler.userStatus.update<"Assessment">({
          blockId,
          data: {
            status: "IN_PROGRESS",
            userData: {
              content: stringifiedContent,
              lastEditedAt: new Date(),
            },
          },
        });

        refreshCourse();
        setLoading(false);
        setOpen(false);
      }}
    >
      {t(loading ? "general.loading" : "save-as-draft")}
    </Button>
  );
}
