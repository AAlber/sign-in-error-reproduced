import { Image as ImageIcon } from "lucide-react";
import { ElementBuilder } from "../registry";
import { ImageIcon as ImageDetailedIcon } from "./detailed-icons";

const Image = new ElementBuilder()
  .withName("image")
  .withDescription("image_desc")
  .withIcon(ImageIcon)
  .withDetailedIcon(<ImageDetailedIcon />)
  .withCategory("Media")
  .withSearchTerms(["img", "image", "picture"])
  .withHelpContent({
    videoUrl:
      "https://www.loom.com/share/fe43cb350e8b44f5a9f8090bed90a8d9?sid=87b27a19-a381-4e7d-b058-92168074e9ab",
    description: "image_help",
  })
  .withSlashCommand("Insert", ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).setImageUpload().run();
  })
  .withOnClickCommand(({ editor }) => {
    editor.chain().focus().setImageUpload().run();
  })
  .withDropCommand(({ editor, pos }) => {
    editor.chain().focus().insertContentAt(pos, { type: "imageUpload" }).run();
  })
  .build();

export default Image;
