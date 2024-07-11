import { MessageCircle } from "lucide-react";
import { EmptyState } from "../../../empty-state/empty-state";

export default function NoChats() {
  return (
    <div className="flex grow flex-col items-center bg-foreground bg-gradient-to-t ">
      <section className="relative mt-[50%] flex flex-col items-center px-14">
        <EmptyState
          icon={MessageCircle}
          title="channel.list.empty.title"
          description="channel.list.empty.description"
        >
          <EmptyState.Article articleId={8679706} />
        </EmptyState>
      </section>
    </div>
  );
}
