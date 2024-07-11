import { Youtube as YoutubeIcon } from "lucide-react";
import { ElementBuilder } from "../registry";
import { YoutubeIcon as YoutubeDetailedIcon } from "./detailed-icons";

const Youtube = new ElementBuilder()
  .withName("youtube")
  .withDescription("youtube_desc")
  .withIcon(YoutubeIcon)
  .withDetailedIcon(<YoutubeDetailedIcon />)
  .withCategory("Media")
  .withSearchTerms(["video", "youtube"])
  .withHelpContent({
    videoUrl:
      "https://www.loom.com/share/a15fd7c73bc3456c944aea217c078bd5?sid=314cf15f-a3d6-4a07-b343-57376c98ec29",
    description: "youtube_help",
  })
  .withSlashCommand("Insert", ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).setYoutubeEmbed().run();
  })
  .withOnClickCommand(({ editor }) => {
    editor.chain().focus().setYoutubeEmbed().run();
  })
  .withDropCommand(({ editor, pos }) => {
    editor.chain().focus().insertContentAt(pos, { type: "youtubeEmbed" }).run();
  })
  .build();

export default Youtube;
