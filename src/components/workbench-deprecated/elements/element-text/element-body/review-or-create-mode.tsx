import * as DOMPurify from "dompurify";
import { useTranslation } from "react-i18next";
import { WorkbenchMode } from "../../../zustand";
import type { ITextElementProps } from "./types";

const ReviewOrCreateMode: React.FC<
  Pick<ITextElementProps, "answer"> & { mode: WorkbenchMode }
> = (props) => {
  const { answer, mode } = props;
  const html = !answer.includes("</p>")
    ? answer.replaceAll("\n", "<br />")
    : answer;

  const { t } = useTranslation("page");
  const sanitizer = DOMPurify.sanitize;
  const className =
    "h-20 w-full rounded-md border border-border bg-foreground px-3 py-2 text-muted";

  if (mode === WorkbenchMode.CREATE || !answer) {
    return (
      <p className={className}>
        {t("workbench.sidebar_element_text_input_placeholder1")}
      </p>
    );
  }

  return (
    <div
      className="text-contrast"
      dangerouslySetInnerHTML={{ __html: sanitizer(html) }}
    />
  );
};

export default ReviewOrCreateMode;
