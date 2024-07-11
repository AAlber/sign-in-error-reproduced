import { useTranslation } from "react-i18next";
import useOpenChatWithUser from "@/src/components/reusable/page-layout/navigator/chat/hooks/useOpenChatWithUser";
import Spinner from "@/src/components/spinner";
import type { ContentBlock } from "@/src/types/course.types";
import useUser from "@/src/zustand/user";
import { useGradingData } from "../hooks/use-grading-data";
import { BlockGraderProfile } from "./grader-profile";

export function BlockPopoverGrading({ block }: { block: ContentBlock }) {
  const { user } = useUser();
  const { t } = useTranslation("page");
  const { grading, graderProfile, loading } = useGradingData({
    block,
    user,
  });
  const { openChatWithUser } = useOpenChatWithUser();

  if (loading)
    return (
      <div className="m-auto flex w-full justify-center pt-3">
        <Spinner size="w-8 h-8" />
      </div>
    );

  return (
    <div className="flex flex-col items-center py-2">
      {grading && block.userStatus === "REVIEWED" ? (
        <>
          <p className="mt-4 text-3xl font-bold">{grading.ratingLabel}</p>
          {graderProfile && (
            <BlockGraderProfile
              graderProfile={graderProfile}
              grading={grading}
              openChatWithUser={openChatWithUser}
            />
          )}
        </>
      ) : (
        <p className="text-sm text-muted-contrast">
          {t("grading_not_available")}
        </p>
      )}
    </div>
  );
}
