// Uppy styles
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import AwsS3Multipart from "@uppy/aws-s3-multipart";
import Uppy, { type UploadResult } from "@uppy/core";
import { Dashboard } from "@uppy/react";
import { sha256 } from "crypto-hash";
import React from "react";

const fetchUploadApiEndpoint = async (endpoint: string, data: any) => {
  const res = await fetch(`/api/cloudflare/gh-multipart-upload/${endpoint}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  return res.json();
};

export function MultipartFileUploader({
  onUploadFinish,
}: {
  onUploadFinish: (result: UploadResult) => void;
}) {
  const uppy = React.useMemo(() => {
    const uppy = new Uppy({
      autoProceed: false,
    }).use(AwsS3Multipart, {
      createMultipartUpload: async (file) => {
        const arrayBuffer = await new Response(file.data).arrayBuffer();
        const fileHash = await sha256(arrayBuffer);
        const contentType = file.type;
        return fetchUploadApiEndpoint("create-multipart-upload", {
          file,
          fileHash,
          contentType,
        });
      },
      prepareUploadParts: (file, partData) =>
        fetchUploadApiEndpoint("prepare-upload-parts", { file, partData }),
      completeMultipartUpload: (file, props) =>
        fetchUploadApiEndpoint("complete-multipart-upload", { file, ...props }),
      listParts: (file, props) =>
        fetchUploadApiEndpoint("list-parts", { file, ...props }),
      abortMultipartUpload: (file, props) =>
        fetchUploadApiEndpoint("abort-multipart-upload", { file, ...props }),
    });
    return uppy;
  }, []);
  uppy.on("complete", (result) => {
    onUploadFinish(result);
  });
  uppy.on("upload-success", (file, response) => {
    uppy.setFileState(file?.id as string, {
      progress: uppy.getState().files[file?.id as string]?.progress,
      uploadURL: response.body.Location,
      response: response,
      isPaused: false,
    });
  });
  return <Dashboard uppy={uppy} showLinkToFileUploadResult={true} />;
}
