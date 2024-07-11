import { track } from "@vercel/analytics";
import { BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { log } from "@/src/utils/logger/logger";
import { Button } from "../shadcn-ui/button";
import { DialogTrigger } from "../shadcn-ui/dialog";
import { useLearnDialog } from "./zustand";

export const Trigger = ({
  id,
  children,
  focusVideo,
}: {
  id: string;
  children?: React.ReactNode;
  focusVideo: string;
}) => {
  const { t } = useTranslation("page");
  const { setFocusVideo } = useLearnDialog();

  return (
    <DialogTrigger
      onClick={() => {
        log.click("Opened learn menu");
        setFocusVideo(focusVideo);
        track("Opened learn resource", { type: "menu", id: id });
      }}
    >
      {children ? (
        children
      ) : (
        <Button className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          {t("learn")}
        </Button>
      )}
    </DialogTrigger>
  );
};
