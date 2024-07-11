import clsx from "clsx";
import type { RefObject, SyntheticEvent } from "react";
import React, { useState } from "react";
import BrowseFiles from "./browse-files";
import File from "./file";
import { useDragAndDropHandlers } from "./useFileDragAndDropHandlers";

type Props = {
  onFileAdded: (file: FileList) => Promise<void | boolean> | void;
  onReset: () => void;
} & React.ComponentPropsWithoutRef<"input">;

const SimpleFileUpload = React.forwardRef<HTMLInputElement, Props>(
  ({ className, onFileAdded, onReset, ...rest }, ref) => {
    const [currentFile, setCurrentFile] = useState<File>();

    const { dragActive, onDragEnter, onDragLeave, onDrop } =
      useDragAndDropHandlers();

    const inputRef = ref as RefObject<HTMLInputElement>;

    const handleFileAdded = (files: FileList) => {
      onFileAdded(files)
        ?.then((result) => {
          if (typeof result === "boolean" && result) {
            setCurrentFile(files[0]);
          } else handleReset();
        })
        .catch(console.log);
    };

    const handleClick = (e: SyntheticEvent) => {
      e.preventDefault();
      inputRef?.current?.click();
    };

    const handleReset = () => {
      onReset();
      setCurrentFile(undefined);
    };

    return (
      <form
        className={clsx(
          className,
          "relative flex items-center justify-center overflow-hidden rounded-lg border-2 border-dashed transition-colors",
          dragActive ? "border-primary" : "border-primary/40",
        )}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
      >
        <input
          className="hidden"
          type="file"
          id="input-file-upload"
          multiple={false}
          ref={inputRef}
          onClick={(e) => {
            // reset value when selecting same file
            e.currentTarget.value = "";
          }}
          onChange={(e) => {
            const files = e.target.files;
            if (files && files[0]) handleFileAdded(files);
          }}
          {...rest}
        />
        {!currentFile ? (
          <BrowseFiles dragActive={dragActive} onClick={handleClick} />
        ) : (
          <File
            filename={currentFile.name}
            onClick={handleClick}
            onReset={handleReset}
          />
        )}
        {dragActive && (
          <div
            className="absolute inset-0 h-full w-full"
            onDragEnter={onDragEnter}
            onDragLeave={onDragEnter}
            onDragOver={onDragEnter}
            onDrop={(e) => {
              const files = onDrop(e);
              handleFileAdded(files);
            }}
          />
        )}
      </form>
    );
  },
);

SimpleFileUpload.displayName = "SimpleFileUpload";
export default SimpleFileUpload;
