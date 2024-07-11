import {
  ContextMenuContent,
  ContextMenuSeparator,
} from "@/src/components/reusable/shadcn-ui/context-menu";
import type { EditorPage } from "../../../../types";
import PageDelete from "./delete";
import PageDuplicate from "./duplicate";
import PageMove from "./move";
import PageNew from "./new-page";

export default function PageContentMenu({
  page,
  index,
}: {
  page: EditorPage;
  index: number;
}) {
  return (
    <ContextMenuContent className="z-[9999]">
      <PageNew page={page} index={index} />
      <PageMove page={page} />
      <PageDuplicate page={page} />
      <ContextMenuSeparator />
      <PageDelete page={page} />
    </ContextMenuContent>
  );
}
