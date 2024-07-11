import * as DOMPurify from "dompurify";
import type { IParagraphElementProps } from "./types";

const FillOutMode: React.FC<Pick<IParagraphElementProps, "paragraph">> = (
  props,
) => {
  const { paragraph } = props;

  /**
   * Make it compatible with
   * existing assessments
   */
  const html = !paragraph.includes("</p>")
    ? paragraph.replaceAll("\n", "<br />")
    : paragraph;
  const sanitizer = DOMPurify.sanitize;
  return (
    <div
      className="text-contrast"
      dangerouslySetInnerHTML={{ __html: sanitizer(html) }}
    />
  );
};

export default FillOutMode;
