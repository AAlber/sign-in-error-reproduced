import { Send, Square } from "lucide-react";
import { Button } from "./shadcn-ui/button";
import { Input } from "./shadcn-ui/input";

interface AIInputFieldProps {
  value: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  stop: () => void;
  placeholder: string;
  isLoading: boolean;
  isDisabled: boolean;
  children?: React.ReactNode;
}

export default function AIInputField({
  value,
  stop,
  children,
  onInputChange,
  onSubmit,
  placeholder,
  isLoading,
  isDisabled,
}: AIInputFieldProps) {
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() !== "") {
        onSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
      }
    }
  };

  return (
    <div className="mb-2 w-full rounded-md border border-border bg-foreground px-1 shadow-sm">
      <form
        onSubmit={onSubmit}
        className="relative flex h-12 items-center gap-2 pr-1"
      >
        <Input
          disabled={isLoading || isDisabled}
          value={value}
          onChange={onInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder}
          className="h-11 flex-1 overflow-y-scroll border-0 border-border bg-transparent text-contrast outline-none focus:border-muted-contrast focus:outline-none focus:ring-0"
        />
        {!isLoading ? (
          <Button size={"icon"} disabled={!value.length} type="submit">
            <Send size={20} />
          </Button>
        ) : (
          <Button size={"icon"} onClick={stop}>
            <Square size={20} />
          </Button>
        )}
        {children}
      </form>
    </div>
  );
}
