import useContentBlockModal from "../../zustand";
import FormAssessment from "./form-assessment-file";
import FormAutoLesson from "./form-auto-lesson";
import FormEditorFile from "./form-editor-file";
import FormFileProtectionSwitch from "./form-file";
import FormSurvey from "./form-survey";
import FormWorkbenchFile from "./form-workbench-file";

function ContentBlockFormCustomField({ fieldName }: { fieldName: string }) {
  const { contentBlockType } = useContentBlockModal();

  switch (contentBlockType) {
    case "Assessment":
      return <FormAssessment />;
    case "StaticWorkbenchFile":
      return <FormWorkbenchFile />;
    case "File":
      return <FormFileProtectionSwitch />;
    case "EditorFile":
      return <FormEditorFile />;
    case "Survey":
      return <FormSurvey />;
    case "AutoLesson":
      return <FormAutoLesson />;
    default:
      return <></>;
  }
}

export default ContentBlockFormCustomField;
