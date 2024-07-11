import TextareaAutosize from "@mui/material/TextareaAutosize";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import classNames from "@/src/client-functions/client-utils";
import type { ContentBlock } from "@/src/types/course.types";
import useCourse from "../../zustand";

export default function PreviewDescription({ block }: { block: ContentBlock }) {
  const { t } = useTranslation("page");
  const { hasSpecialRole } = useCourse();
  const [description, setDescription] = useState<any>(block.description);
  const [readMore, setReadMore] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const divRef: any = useRef(null);

  useEffect(() => {
    setDescription(block.description);
  }, [block]);

  useEffect(() => {
    if (!hasSpecialRole && !description) return;
    if (!isEditing) scrollToTop();
  }, [isEditing]);

  if (!hasSpecialRole && !description) return null;

  const scrollToTop = () => {
    divRef.current.scrollTop = 0;
  };

  return (
    <p className="-mt-2 flex flex-col items-start gap-1 text-sm text-muted-contrast">
      <TextareaAutosize
        className={classNames(
          "text- -mx-2.5 w-full resize-none border-none bg-transparent pb-5 text-left text-sm placeholder-muted-contrast focus:outline-none focus:ring-0",
          readMore ? "overflow-scroll" : "overflow-hidden",
        )}
        value={description}
        placeholder={
          hasSpecialRole
            ? t("course_main_content_block_add_description")
            : t("course_main_content_block_no_description")
        }
        onChange={(e) => setDescription(e.target.value)}
        maxLength={500}
        disabled={!hasSpecialRole}
        onFocus={() => setIsEditing(true)}
        onBlur={() => {
          setIsEditing(false);
          if (description !== block.description)
            contentBlockHandler.update.block({ id: block.id, description });
        }}
        maxRows={readMore || isEditing ? 10 : 2}
        defaultValue={description}
        ref={divRef}
        aria-label="maximum height"
      />{" "}
      {!isEditing && description?.length > 110 && (
        <button
          className="ver:opacity-80 mx-0.5 text-right text-sm text-contrast"
          onClick={() => setReadMore(!readMore)}
        >
          {" "}
          {readMore
            ? t("course_main_content_block_description_read_less")
            : t("course_main_content_block_description_read_more")}{" "}
          {readMore ? (
            <ChevronUp className="inline-block" size={16} />
          ) : (
            <ChevronDown className="inline-block" size={16} />
          )}{" "}
        </button>
      )}{" "}
    </p>
  );
}
