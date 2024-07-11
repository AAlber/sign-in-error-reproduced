import { Video } from "lucide-react";
import { ContentBlockBuilder } from "../../registry";
import { openVideo } from "./open";

export const video = new ContentBlockBuilder("Video")
  .withName("video")
  .withCategory("InfoMaterials")
  .withDescription("video-description")
  .withHint("video_hint")
  .withForm({
    videoUrl: {
      label: "video_url",
      fieldType: "input",
      defaultValue: "",
      verification: (value) => {
        // Basic URL validation
        const urlPattern = new RegExp(
          "^(https?:\\/\\/)?" + // protocol (http or https)
            "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
            "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
            "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
            "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
            "(\\#[-a-z\\d_]*)?$",
          "i",
        ); // fragment locator

        if (!urlPattern.test(value)) {
          return "invalid_url";
        }

        return null;
      },
    },
    type: {
      fieldType: "select",
      label: "video_type",
      defaultValue: "youtube",
      options: ["youtube", "vimeo"] satisfies SupportedVideoType[],
    },
    showVideoControls: {
      label: "show_video_controls",
      description: "show_video_controls_description",
      fieldType: "switch",
      defaultValue: false,
      advanced: true,
    },
  })
  .withOpeningProcedure((block, userStatus) =>
    openVideo(block, userStatus as any),
  )
  .withStyle({
    icon: <Video className="h-4 w-4" />,
  })
  .withPopoverSettings({ hasOpenButton: true, hasMarkAsFinishedButton: false })
  .build();

export default video;
