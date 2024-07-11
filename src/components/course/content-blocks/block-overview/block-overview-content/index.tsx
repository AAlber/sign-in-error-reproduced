import type { ContentBlock } from "@/src/types/course.types";
import PreviewDraftState from "./draft-state";
import { SurveyOverview } from "./published-state/user-survey-overview";
import UserTableUserTable from "./published-state/user-table-assessment";
import UserTableAudio from "./published-state/user-table-audio";
import UserTableAutoLesson from "./published-state/user-table-auto-lesson";
import UserTableEditorFile from "./published-state/user-table-editor-file";
import { UserTableExternalDeliverable } from "./published-state/user-table-external-content";
import UserTableFile from "./published-state/user-table-file";
import UserTableFuxamFile from "./published-state/user-table-fuxam-file";
import UserTableHandIn from "./published-state/user-table-hand-in";
import { UserTableLink } from "./published-state/user-table-link";
import UserTableProtectedFile from "./published-state/user-table-protected-file";
import UserTableVideo from "./published-state/user-table-video";
import UserTableDocuChat from "./user-table-docu-chat";

export default function OverviewContent({ block }: { block: ContentBlock }) {
  if (["COMING_SOON", "DRAFT"].includes(block.status))
    return <PreviewDraftState block={block} />;

  switch (block.type) {
    case "Assessment":
      return <UserTableUserTable block={block as ContentBlock<"Assessment">} />;
    case "AutoLesson":
      return (
        <UserTableAutoLesson block={block as ContentBlock<"AutoLesson">} />
      );
    case "File":
      return <UserTableFile block={block as ContentBlock<"File">} />;
    case "ProtectedFile":
      return (
        <UserTableProtectedFile
          block={block as ContentBlock<"ProtectedFile">}
        />
      );
    case "StaticWorkbenchFile": //
      return (
        <UserTableFuxamFile
          block={block as ContentBlock<"StaticWorkbenchFile">}
        />
      );
    case "HandIn":
      return <UserTableHandIn block={block as ContentBlock<"HandIn">} />;
    case "EditorFile":
      return (
        <UserTableEditorFile block={block as ContentBlock<"EditorFile">} />
      );
    case "Video":
      return <UserTableVideo block={block as ContentBlock<"Video">} />;
    case "Audio":
      return <UserTableAudio block={block as ContentBlock<"Audio">} />;
    case "DocuChat":
      return <UserTableDocuChat block={block as ContentBlock<"DocuChat">} />;
    case "Link":
      return <UserTableLink block={block as ContentBlock<"Link">} />;
    case "Survey":
      return <SurveyOverview block={block as ContentBlock<"Survey">} />;
    case "ExternalDeliverable":
      return (
        <UserTableExternalDeliverable
          block={block as ContentBlock<"ExternalDeliverable">}
        />
      );
    default:
      return null;
  }
}
