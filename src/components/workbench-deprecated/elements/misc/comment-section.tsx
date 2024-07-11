import { useTranslation } from "react-i18next";
import {
  areObjectsValueEqual,
  useCustomForm,
} from "@/src/client-functions/client-workbench";
import useUser from "../../../../zustand/user";
import UserDefaultImage from "../../../user-default-image";
import ControlledInput from "../../components/controlled-input";
import type { ElementMetadata } from "../../types";
import useWorkbench, { WorkbenchMode } from "../../zustand";

type CommentField = {
  review_comment: NonNullable<ElementMetadata["review_comment"]>;
};

export default function CommentSection({ elementId }) {
  const { mode, selectedUser, getElementMetadata, updateElementMetadata } =
    useWorkbench();
  const { user: user } = useUser();
  const { t } = useTranslation("page");

  const review_comment = getElementMetadata(elementId).review_comment;

  const { control, handleSubmit } = useCustomForm<CommentField>({
    formProps: {
      defaultValues: {
        review_comment,
      },
    },
    elementId,
    key: "review_comment.text",
  });

  async function handleUpdateMeta(value: CommentField) {
    const data = {
      review_comment: {
        text: value.review_comment?.text,
        user: {
          id: user.id,
          name: user.name,
          image: user.image ?? "",
        },
      },
    };

    if (!review_comment) return;
    if (areObjectsValueEqual(data.review_comment, { ...review_comment }))
      return;

    updateElementMetadata(elementId, {
      review_comment: data.review_comment,
    });
  }

  return (
    <>
      {getElementMetadata(elementId)?.review_comment === undefined &&
        mode === WorkbenchMode.REVIEW && (
          <button
            onClick={() => {
              updateElementMetadata(elementId, {
                review_comment: {
                  text: "",
                  user: {
                    id: user.id,
                    name: user.name,
                    image: user.image ?? "",
                  },
                },
              });
            }}
            className="mt-3.5 w-full text-right text-primary hover:opacity-70"
          >
            {t("workbench.element_comment_add")}
          </button>
        )}
      {getElementMetadata(elementId).review_comment !== undefined && (
        <div className="mt-3.5">
          <div className="flex text-muted-contrast">
            <UserDefaultImage
              dimensions={"h-6 w-6"}
              user={review_comment?.user}
            />
            <span className="ml-3 mr-1.5 font-medium text-contrast">
              {review_comment?.user?.name}
            </span>
            {t("workbench.element_comment_commented")}
          </div>
          <ControlledInput
            control={control}
            name="review_comment.text"
            type="textarea"
            textareaProps={{
              onBlur: handleSubmit(handleUpdateMeta),
              disabled: mode !== WorkbenchMode.REVIEW,
              placeholder: t("workbench.element_comment_input_placeholder"),
              className:
                "min-h-16 mt-5 flex w-full select-auto resize-none items-end justify-start rounded-md border border-border bg-foreground text-contrast outline-none ring-0 placeholder:text-muted focus:outline-none focus:ring-0 ",
            }}
          />
        </div>
      )}
    </>
  );
}
