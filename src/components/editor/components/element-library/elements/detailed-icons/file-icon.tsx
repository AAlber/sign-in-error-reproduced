import { FileUp } from "lucide-react";

export const FileIcon = (): JSX.Element => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <FileUp size={28} className="text-muted-contrast" strokeWidth={1} />
    </div>
  );
};
