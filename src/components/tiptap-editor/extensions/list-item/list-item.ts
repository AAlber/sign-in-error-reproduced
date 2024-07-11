import ListItemExtension from "@tiptap/extension-list-item";
import { ListItemText } from "./list-item-text";

export const ListItem = ListItemExtension.extend({
  name: "listItem",
  content: "listItemText block*",
  addExtensions() {
    return [ListItemText];
  },
});
