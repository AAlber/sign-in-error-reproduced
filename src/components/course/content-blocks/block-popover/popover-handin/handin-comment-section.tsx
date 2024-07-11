import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { Textarea } from "@/src/components/reusable/shadcn-ui/text-area";

export const HandInCommentSection = ({
  uploading,
  loading,
  fileExists,
  comment,
  setComment,
}: {
  uploading: boolean;
  loading: boolean;
  fileExists: boolean;
  comment: string;
  setComment: (value: string) => void;
}) => {
  const { t } = useTranslation("page");
  const [showComment, setShowComment] = useState(false);

  return (
    <>
      {showComment && (
        <Textarea
          className="w-full ring-0 ring-offset-0 focus:border-primary"
          placeholder={t("content_block_hand_in_add_comment_placeholder")}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        >
          {comment}
        </Textarea>
      )}
      <Button
        variant={"link"}
        onClick={() => setShowComment(true)}
        disabled={!fileExists || uploading || loading}
        className="flex w-full justify-end"
        size={"small"}
      >
        {t("content_block_hand_in_add_comment")}
      </Button>
    </>
  );
};
