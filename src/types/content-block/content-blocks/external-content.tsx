import { ExternalLink } from "lucide-react";
import { BlockExternalDeliverablePopOver } from "@/src/components/course/content-blocks/block-popover/block-custom-popover-components/block-external-content";
import { ContentBlockBuilder } from "../registry";

const ExternalDeliverable = new ContentBlockBuilder("ExternalDeliverable")
  .withName("content_block.external_content")
  .withDescription("content_block.external_content_description")
  .withCategory("UserDeliverables")
  .withHint("content_block.external_content_hint")
  .withForm({
    studentCanMarkAsFinished: {
      label: "content_block.external_content_mark_as_done",
      description: "content_block.external_content_mark_as_done_description",
      fieldType: "switch",
      defaultValue: false,
    },
  })
  .withStyle({
    icon: <ExternalLink className="h-4 w-4" />,
  })
  .withPopoverSettings({
    hasMarkAsFinishedButton: false,
    hasOpenButton: false,
    customContentComponent: BlockExternalDeliverablePopOver,
  })
  .build();

export default ExternalDeliverable;
