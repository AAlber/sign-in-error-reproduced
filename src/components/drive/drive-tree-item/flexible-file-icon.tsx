import { FileIcon, FileText, ImageIcon } from "lucide-react";
import mime from "mime";
import { memo, useMemo } from "react";
import { documentFileTypes } from "@/src/utils/utils";

export const FlexibleFileIcon = memo(function FlexibleFileIcon({
  fileName,
}: {
  fileName?: string;
}) {
  const fileType = useMemo(
    () => (fileName ? mime.getType(fileName) : "file"),
    [fileName],
  );

  switch (true) {
    case fileType?.includes("image"):
      return <ImageIcon className="h-4 w-4" />;
    case documentFileTypes.includes(fileType || "file"):
      return <FileText className={"h-4 w-4"} />;
    default:
      return <FileIcon className="h-4 w-4" />;
  }
});
