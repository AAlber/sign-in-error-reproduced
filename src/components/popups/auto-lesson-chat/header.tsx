import { X } from "lucide-react";
import { Button } from "../../reusable/shadcn-ui/button";
import useAutoLessonChat from "./zustand";

export default function ChapterHeader() {
  const { block, reset, currentChapter } = useAutoLessonChat();

  return (
    <div className="flex h-20 w-full items-center gap-4 border-b border-border bg-foreground p-4">
      <div className="flex flex-col">
        <h2 className="text-xl font-semibold">
          {block.specs.chapters[currentChapter]?.title ?? ""}
        </h2>
        <p className="text-sm text-muted-contrast">
          {block.specs.chapters[currentChapter]?.description ?? ""}{" "}
        </p>
      </div>
      <div className="flex h-full w-full flex-1 items-start justify-end">
        <Button onClick={reset} variant={"ghost"} size={"icon"}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
