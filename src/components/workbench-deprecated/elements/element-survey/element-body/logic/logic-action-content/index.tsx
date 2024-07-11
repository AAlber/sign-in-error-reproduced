import type { SurveyLogic } from "../../..";
import LogicAttachFuxamContentFile from "./import-content-file";
import LogicLinkInput from "./link-input";
import LogicUploadFile from "./upload-file";

export default function LogicActionContent({
  elementId,
  logic,
}: {
  elementId: string;
  logic: SurveyLogic;
}) {
  return (
    <>
      {logic.actionType === "open link" && (
        <LogicLinkInput elementId={elementId} logic={logic} />
      )}
      {logic.actionType === "download file" && (
        <LogicUploadFile elementId={elementId} logic={logic} />
      )}
      {logic.actionType === "unlock content" && (
        <LogicAttachFuxamContentFile elementId={elementId} logic={logic} />
      )}
    </>
  );
}
