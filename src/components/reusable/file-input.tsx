import { Paperclip, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import classNames from "@/src/client-functions/client-utils";

type FileInputProps = {
  file: File | null;
  setFile: (file: File | null) => void;
  accept?: string;
  placeholder: string;
};

export default function FileInput(props: FileInputProps) {
  const { t } = useTranslation("page");
  return (
    <div className="relative flex h-9 w-full cursor-pointer items-center rounded-lg border border-border bg-background  px-2 text-muted-contrast hover:bg-foreground ">
      <Paperclip
        className={classNames(
          "pointer-events-none mr-2 w-4",
          props.file ? "text-primary" : "text-muted-contrast",
        )}
      />
      <span
        className={classNames(
          "pointer-events-none",
          props.file ? "text-contrast" : "text-muted-contrast",
        )}
      >
        {props.file
          ? props.file.name.length > 30
            ? props.file.name.slice(0, 30) + "..."
            : props.file.name
          : t(props.placeholder)}
      </span>
      {props.file && (
        <button
          className="pointer-events-auto absolute right-2 z-50 hover:text-destructive"
          onClick={() => {
            props.setFile(null);
          }}
        >
          <X className="h-4 w-4" />
        </button>
      )}
      <input
        id="file"
        name="file"
        type="file"
        accept={props.accept}
        onChange={async (event) => {
          const file =
            event.currentTarget.files && event.currentTarget.files[0];
          if (file) {
            props.setFile(file);
          }
        }}
        className="absolute h-full w-full cursor-pointer rounded-md border-border opacity-0"
      />
    </div>
  );
}
