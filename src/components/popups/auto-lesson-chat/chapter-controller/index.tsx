import { truncate } from "@/src/client-functions/client-utils";
import useAutoLessonChat from "../zustand";
import ChapterSteps from "./steps";

export default function ChatSidebar() {
  const { block } = useAutoLessonChat();

  if (!block) return null;

  return (
    <div className="relative hidden h-full w-[300px] flex-col items-center justify-start overflow-hidden border-r border-border bg-foreground lg:flex dark:bg-gradient-to-t dark:from-foreground dark:to-background">
      <div className="flex h-20 w-[300px] items-center justify-center break-words border-b border-border bg-foreground px-5 text-center">
        <h1 className="text-xl font-bold text-contrast">
          {truncate(block.name, 30)}
        </h1>
      </div>
      <ChapterSteps />
    </div>
  );
}
