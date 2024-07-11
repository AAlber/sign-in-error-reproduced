import type { ContentBlockUserGrading, UserStatus } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { Label } from "@/src/components/reusable/shadcn-ui/label";
import { Textarea } from "@/src/components/reusable/shadcn-ui/text-area";
import { toast } from "@/src/components/reusable/toaster/toast";
import Spinner from "@/src/components/spinner";
import type { UpsertUserGrading } from "@/src/types/content-block/types/cb-types";
import type { ContentBlock } from "@/src/types/course.types";
import BlockRatingSelector from "../block-rating-selector";
import { ConfirmChangeGradingDialog } from "./confirm-change-grading-dialog";

type Props = {
  userId: string;
  block: ContentBlock;
  onGraded: (userId: string, gradings: ContentBlockUserGrading) => void;
};

export const BlockPopoverContent = ({ userId, block, onGraded }: Props) => {
  const { t } = useTranslation("page");

  const [comment, setComment] = useState("");
  const [upsertGrading, setUpsertGrading] =
    useState<Omit<UpsertUserGrading, "text">>();

  const [rating, setRating] = useState<ContentBlockUserGrading>();
  const [userStatusLoading, setUserStatusLoading] = useState(false);
  const [userStatus, setUserStatus] = useState<UserStatus>();
  const [submitLoading, setSubmitLoading] = useState(false);

  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (!block) return;
    setUserStatusLoading(true);
    contentBlockHandler.userStatus
      .getForUser({ blockId: block.id, userId })
      .then((b) => {
        setComment(b.rating?.text || "");
        setRating(b.rating);
        setUserStatusLoading(false);
        setUserStatus(b.status);
      });
  }, [block]);

  const handleSubmit = async (fromModal = false) => {
    if (!upsertGrading?.ratingLabel) return;
    if (!fromModal && userStatus === "REVIEWED") {
      setShowDialog(true);
      return;
    }
    setSubmitLoading(true);
    try {
      if (!rating) {
        await contentBlockHandler.create.userGrading({
          ...upsertGrading,
          text: comment,
        });
        onGraded(userId, { ...upsertGrading, text: comment } as any);
      } else {
        await contentBlockHandler.update.userGrading({
          ...upsertGrading,
          id: rating.id,
          text: comment,
        });
        onGraded(userId, {
          ...upsertGrading,
          text: comment,
          id: rating.id,
        } as any);
      }

      toast.success("general.success", {
        description: "grading_submitted",
      });
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitLoading(false);
    }
  };

  const gradingNotReady = userStatusLoading && !upsertGrading?.ratingLabel;

  return (
    <div className="flex w-full flex-col gap-3">
      <Label>{t("rating")}</Label>
      {!gradingNotReady ? (
        <BlockRatingSelector
          userId={userId}
          rating={rating}
          onLoadedGrading={setUpsertGrading}
        />
      ) : (
        <Spinner size="w-5 h-5" />
      )}

      <Label className="mt-2">{t("comment")}</Label>
      <Textarea
        value={comment}
        disabled={userStatusLoading}
        onChange={(e) => {
          if (upsertGrading) {
            setComment(e.target.value);
          }
        }}
      />
      <Button
        disabled={userStatusLoading || submitLoading}
        onClick={async () => await handleSubmit()}
        className="mt-2"
        variant="cta"
      >
        {gradingNotReady || submitLoading
          ? t("general.loading")
          : t("submit_grading")}
      </Button>

      <ConfirmChangeGradingDialog
        open={showDialog}
        setOpen={setShowDialog}
        loading={submitLoading}
        onConfirm={async () => await handleSubmit(true)}
      />
    </div>
  );
};
