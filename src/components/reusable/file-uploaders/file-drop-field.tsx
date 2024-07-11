// Uppy styles
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import { Dashboard } from "@uppy/react";
import { useEffect, useMemo } from "react";
import { initializeFileUploader } from "@/src/client-functions/client-cloudflare/uppy-logic";
import UploadButton from "./upload-button";
import type { UploaderData } from "./zustand";
import useFileDrop from "./zustand";

export function FileDropField(data?: Partial<UploaderData>) {
  const {
    uppy: zustandUppy,
    fileLength,
    setUppy,
    setFileLength,
  } = useFileDrop();

  const finalUppy = useMemo(() => {
    const uppy = data?.uploadPathData
      ? initializeFileUploader(data)
      : zustandUppy;
    if (!uppy) throw new Error("No Uppy");
    setUppy(uppy);
    return uppy;
  }, []);

  const hideButtons = data?.uploadPathData
    ? data.autoProceed === undefined || data.autoProceed === false
      ? false
      : true
    : true;
  useEffect(() => {
    setFileLength(finalUppy.getFiles().length);
  }, []);

  return finalUppy ? (
    <>
      <Dashboard
        uppy={finalUppy}
        proudlyDisplayPoweredByUppy={false}
        showLinkToFileUploadResult={true}
        className="!h-auto"
      />
      {fileLength > 0 && finalUppy && !hideButtons && (
        <UploadButton uppy={finalUppy} />
      )}
    </>
  ) : (
    <></>
  );
}
