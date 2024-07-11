import { Info } from "lucide-react";
import HelpVideoHover from "@/src/components/reusable/help-video-hover";
import { Button } from "@/src/components/reusable/shadcn-ui/button";

export default function ContentHelpVideos() {
  return (
    <HelpVideoHover
      type="multi"
      tabs={[
        {
          url: "help_assessment_url",
          tabTitle: "Assessment",
          title: "Assessment",
          description: "help_assessment_description",
        },
        {
          url: "help_handin_url",
          tabTitle: "Hand In",
          title: "Hand In",
          description: "help_handin_description",
        },
        {
          url: "help_learning_url",
          tabTitle: "Learning",
          title: "Learning",
          description: "help_learning_description",
        },
        {
          url: "help_autolesson_url",
          tabTitle: "Auto Lesson",
          title: "Auto Lesson",
          description: "help_autolesson_description",
        },
      ]}
    >
      <Button size={"icon"}>
        <Info className="h-4 w-4" />
      </Button>
    </HelpVideoHover>
  );
}
