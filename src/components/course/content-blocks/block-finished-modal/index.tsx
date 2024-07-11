import { useState } from "react";
import { useTranslation } from "react-i18next";
import learningJourneyHelper from "@/src/client-functions/client-contentblock/learning-journey-helper";
import { replaceVariablesInString } from "@/src/client-functions/client-utils";
import Modal from "@/src/components/reusable/modal";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/reusable/shadcn-ui/card";
import { ActionButtons } from "./action-buttons";
import { CurrentCourseProgressBar } from "./current-course-progress-bar";
import useContentBlockFinishedModal from "./zustand";

export default function ContentBlockFinishedModal() {
  const { open, setOpen } = useContentBlockFinishedModal();
  const [title] = useState<string>("");
  const { t } = useTranslation("page");
  const contentBlocks = learningJourneyHelper.getContentBlocks(true, true);

  const contentBlocksLength = !!contentBlocks ? contentBlocks.length : 0;

  const finishedBlocks = !!contentBlocks
    ? contentBlocks.filter(
        (block) =>
          block.userStatus === "FINISHED" || block.userStatus === "REVIEWED",
      )
    : [];

  const percentage =
    finishedBlocks.length === 0
      ? 0
      : Math.round((finishedBlocks.length / contentBlocksLength) * 100);
  return (
    <Modal open={open} setOpen={setOpen} size="xs" noCloseButton>
      <CardHeader className="px-0 pb-4 pt-0">
        <CardTitle>
          {t(percentage < 100 ? title : "finished-all-blocks")}
        </CardTitle>
        <CardDescription>
          {replaceVariablesInString(t("finished-blocks-description"), [
            finishedBlocks.length,
            contentBlocks?.length,
          ])}
        </CardDescription>
      </CardHeader>
      <CurrentCourseProgressBar />
      <ActionButtons />
    </Modal>
  );
}
