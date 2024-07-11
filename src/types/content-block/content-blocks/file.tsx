import { File } from "lucide-react";
import { uploadContentBlockFiles } from "@/src/client-functions/client-cloudflare/uppy-logic";
import { FilesBlockPopover } from "@/src/components/course/content-blocks/block-popover/files-block-popover";
import useContentBlockModal from "@/src/components/course/content-blocks/content-block-creator/zustand";
import { ContentBlockBuilder } from "../registry";

const file = new ContentBlockBuilder("File")
  .withName("files")
  .withCategory("InfoMaterials")
  .withDescription("file-description")
  .withHint("file_hint")
  .withPreCreationStep(async () => {
    const { data, setData } = useContentBlockModal.getState();
    const urls = await uploadContentBlockFiles();
    if (urls) {
      setData<"File">({
        files: urls,
        isProtected: data.isProtected ?? false,
      });
    }
  })
  .withForm({
    files: {
      label: "file",
      description: "learning_file_upload_description",
      fieldType: "file",
      allowedFileTypes: ["*"],
    },
    isProtected: {
      label: "file",
      fieldType: "custom",
      advanced: true,
    },
  })
  .withStyle({
    icon: <File className="h-4 w-4" />,
  })
  .withPopoverSettings({
    hasMarkAsFinishedButton: true,
    hasOpenButton: false,
    customContentComponent: FilesBlockPopover,
  })
  .build();

export default file;
