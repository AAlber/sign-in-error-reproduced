import { useEffect, useState } from "react";
import { initializeFileUploader } from "@/src/client-functions/client-cloudflare/uppy-logic";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import useFileDrop from "@/src/components/reusable/file-uploaders/zustand";
import type { ContentBlock } from "@/src/types/course.types";
import { maxFileSizes } from "@/src/utils/utils";

export function useHandInPopoverEffects(block: ContentBlock) {
  const { setUppy } = useFileDrop();
  const [loading, setLoading] = useState(true);
  const [fileUrl, setFileUrl] = useState<string>("");
  const [fileExists, setFileExists] = useState<boolean>(false);

  useEffect(() => {
    const uppy = initializeFileUploader({
      uploadPathData: {
        type: "handIn",
        blockId: block.id,
        layerId: block.layerId,
      },
      maxFileSize: maxFileSizes.files,
      allowedFileTypes:
        block.specs.allowedFileTypes === "*"
          ? undefined
          : block.specs.allowedFileTypes.split(", "),
    });
    uppy.on("file-added", () => setFileExists(true));
    uppy.on("file-removed", () => {
      setFileExists(false);
    });
    setUppy(uppy);
  }, [block.id, block.layerId, block.specs.allowedFileTypes, setUppy]);

  useEffect(() => {
    setLoading(true);
    contentBlockHandler.userStatus
      .getForUser<"HandIn">({ blockId: block.id })
      .then((status) => {
        setLoading(false);
        if (!status.userData) return;
        if (!status.userData.url) return;
        setFileUrl(status.userData?.url);
      });
  }, [block.id]);

  return { loading, fileUrl, fileExists };
}
