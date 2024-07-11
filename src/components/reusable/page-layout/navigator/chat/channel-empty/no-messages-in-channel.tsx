import { MessageCircle } from "lucide-react";
import { EmptyState } from "@/src/components/reusable/empty-state";

/** UI to show if channel is defined, but there are no conversations yet inside the channel */
export default function NoMessagesInChannel() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <section className="relative my-auto flex flex-col items-center px-14 py-5">
        <EmptyState
          icon={MessageCircle}
          title="chat.empty.title"
          description="chat.empty.description"
        >
          <EmptyState.Article articleId={8679706} />
        </EmptyState>
      </section>
    </div>
  );
}
