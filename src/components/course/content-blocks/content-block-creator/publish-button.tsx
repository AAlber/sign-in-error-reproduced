import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import useFileDrop from "@/src/components/reusable/file-uploaders/zustand";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import {
  HoverCard,
  HoverCardSheet,
  HoverCardTrigger,
} from "@/src/components/reusable/shadcn-ui/hover-card";
import Tip from "@/src/components/reusable/tips/tip";
import useCourse from "../../zustand";
import useCustomFormAutoLesson from "./forms/custom-form-fields/form-auto-lesson/zustand";
import useContentBlockCreator from "./zustand";

export default function ContentBlockCreatorPublishButton() {
  const { t } = useTranslation("page");
  const { uppy } = useFileDrop();
  const { course, setContentBlocks, contentBlocks } = useCourse();
  const { chapters } = useCustomFormAutoLesson();
  const {
    id,
    name,
    description,
    setLoading,
    setOpen,
    loading,
    data,
    contentBlockType,
    error,
    startDate,
    dueDate,
  } = useContentBlockCreator();

  if (!contentBlockType) return null;
  if (!course?.layer_id) return null;
  const requiresFile =
    contentBlockType === "DocuChat" ||
    contentBlockType === "File" ||
    contentBlockType === "ProtectedFile" ||
    contentBlockType === "AutoLesson";
  const noFileToUpload = requiresFile && uppy?.getFiles().length === 0;

  const requiresChapters = contentBlockType === "AutoLesson";
  const noChapters = requiresChapters && chapters.length === 0;
  return (
    <HoverCard openDelay={250}>
      <HoverCardTrigger>
        <Button
          variant={"cta"}
          disabled={
            loading || !data || !name || !!error || noFileToUpload || noChapters
          }
          onClick={async () => {
            if (!data) return;

            setLoading(true);
            const newBlock = await contentBlockHandler.create.block({
              id,
              name,
              description,
              layerId: course.layer_id,
              status: "PUBLISHED",
              type: contentBlockType,
              specs: data,
              dueDate: dueDate!,
              startDate: startDate!,
            });

            if (newBlock) setContentBlocks([...contentBlocks, newBlock]);
            setLoading(false);
            setOpen(false);
          }}
        >
          {t(loading ? "general.loading" : "publish")}
        </Button>
      </HoverCardTrigger>
      <HoverCardSheet side="bottom">
        <Tip description="publish_block_status_course_layers_description" />
      </HoverCardSheet>
    </HoverCard>
  );
}
