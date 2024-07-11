import { Upload } from "lucide-react";
import HandInPopover from "@/src/components/course/content-blocks/block-popover/popover-handin";
import { ContentBlockBuilder } from "../registry";

export const handIn = new ContentBlockBuilder("HandIn")
  .withName("hand-in")
  .withCategory("UserDeliverables")
  .withDescription("handin-description")
  .withHint("handin_hint")
  .withForm({
    allowedFileTypes: {
      label: "restrict-file-types",
      description: "restrict-file-types-description",
      fieldType: "select",
      defaultValue: "*",
      advanced: true,
      options: [
        "*",
        "image/*, .jpg, .jpeg, .png, .gif, .svg, .webp",
        ".mp4, .mov, .avi, .mkv, .webm, .mpeg",
        ".mp3, .wav, .ogg, .flac, .aac, .wma, .m4a, .midi, .alac",
        ".pdf",
        ".docx",
        ".csv",
        ".pptx",
        ".xlsx",
        ".zip",
      ],
    },
    isSharedSubmission: {
      label: "shared-submission-files",
      description: "shared-submission-files-description",
      fieldType: "switch",
      defaultValue: false,
      advanced: true,
    },
    isGroupSubmission: {
      label: "group-submission",
      description: "group-submission-description",
      fieldType: "switch",
      defaultValue: false,
      advanced: true,
    },
  })
  .withStyle({
    icon: <Upload className="h-4 w-4" />,
  })
  .withPopoverSettings({
    hasMarkAsFinishedButton: false,
    hasOpenButton: false,
    customContentComponent: HandInPopover,
  })
  .build();

export default handIn;
