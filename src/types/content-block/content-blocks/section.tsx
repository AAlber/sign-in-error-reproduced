import { Divide } from "lucide-react";
import { ContentBlockBuilder } from "../registry";

const section = new ContentBlockBuilder("Section")
  .withName("cb.section")
  .withDescription("cb.section_description")
  .withHint("cb.section_hint")
  .withStyle({
    icon: <Divide className="h-4 w-4" />,
  })
  .withOptions({
    canBePrerequisite: false,
    hasUserOverview: false,
  })

  .build();

export default section;
