import { ListChecks } from "lucide-react";
import { BlockSurvey } from "@/src/components/course/content-blocks/block-popover/block-survey";
import { ContentBlockBuilder } from "../registry";

export const survey = new ContentBlockBuilder("Survey")
  .withName("cb.survey_name")
  .withStatus("beta")
  .withDescription("cb.survey.description")
  .withStyle({
    icon: <ListChecks className="h-4 w-4" />,
  })
  .withPopoverSettings({
    hasMarkAsFinishedButton: false,
    hasOpenButton: false,
    customContentComponent: BlockSurvey,
  })
  .withHint("cb.survey_hint")
  .withCategory("UserDeliverables")
  .withForm({
    questions: {
      label: "cb.survey_table.questions",
      fieldType: "custom",
    },
    isAnonymous: {
      label: "cb.survey_table.is_anonymous",
      fieldType: "switch",
      defaultValue: false,
    },
  })
  .build();
