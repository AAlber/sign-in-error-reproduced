import { Link } from "lucide-react";
import { BlockLinkButtons } from "@/src/components/course/content-blocks/block-popover/block-custom-popover-components/block-link";
import { ContentBlockBuilder } from "../registry";

const link = new ContentBlockBuilder("Link")
  .withName("link")
  .withDescription("link-description")
  .withCategory("InfoMaterials")
  .withHint("link_hint")
  .withForm({
    url: {
      label: "content-block-link-url",
      fieldType: "input",
      defaultValue: "",
      verification: (value: string) => {
        const urlPattern = new RegExp(
          "^(https?:\\/\\/)?" + // protocol (http or https)
            "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
            "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
            "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
            "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
            "(\\#[-a-z\\d_]*)?$",
          "i",
        );

        if (!value) return "url-required";
        if (!urlPattern.test(value)) return "invalid-url";
        return null;
      },
    },
  })
  .withStyle({
    icon: <Link className="size-4" />,
  })
  .withPopoverSettings({
    hasMarkAsFinishedButton: false,
    hasOpenButton: false,
    customContentComponent: BlockLinkButtons,
  })
  .withOpeningProcedure((block) => {
    const url = block.specs.url;
    window.open(url, "_blank");
  })
  .build();

export default link;
