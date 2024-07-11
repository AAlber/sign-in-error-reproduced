import { useEffect, useState } from "react";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import { toast } from "@/src/components/reusable/toaster/toast";
import type { ContentBlock } from "@/src/types/course.types";
import useCourse from "../../zustand";

export default function PreviewName({ block }: { block: ContentBlock }) {
  const [name, setName] = useState(block.name);
  const originalName = block.name;
  const { hasSpecialRole } = useCourse();

  useEffect(() => {
    setName(block.name);
  }, [block]);

  return (
    <input
      type="text"
      placeholder="Add a name"
      value={name}
      disabled={!hasSpecialRole}
      onChange={(e) => setName(e.target.value)}
      maxLength={50}
      onBlur={() => {
        if (name.trim() === "") {
          setName(originalName);
          return toast.warning("That's a little short...", {
            description: "Please enter a name for this block.",
            icon: "🤏",
          });
        }
        if (name !== originalName)
          return contentBlockHandler.update.block({ id: block.id, name });
      }}
      className="flex items-center justify-between border-transparent bg-transparent p-0 text-2xl font-medium text-contrast outline-none ring-0 focus:border-transparent focus:outline-none focus:ring-0 "
    />
  );
}
