import { PlusIcon } from "lucide-react";
import React, { useRef } from "react";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { Input } from "@/src/components/reusable/shadcn-ui/input";
import type { PollSchemaType } from "@/src/types/chat/polls";

type Props = {
  newOption: string;
  setNewOption: (value: string) => void;
  onAdd: (value: PollSchemaType["options"][number]) => void;
};

export function AddOption({ newOption, setNewOption, onAdd }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex gap-2">
      <Input
        ref={inputRef}
        placeholder="Add"
        value={newOption}
        onKeyDown={(e) => {
          if (newOption && e.key === "Enter") {
            onAdd({ text: newOption });
            setNewOption("");
          }
        }}
        onChange={(e) => {
          setNewOption(e.target.value);
        }}
      />
      <Button
        onClick={() => {
          if (!newOption) return;
          onAdd({ text: newOption });
          setNewOption("");
          inputRef.current?.focus();
        }}
      >
        <PlusIcon className="size-4" />
      </Button>
    </div>
  );
}
