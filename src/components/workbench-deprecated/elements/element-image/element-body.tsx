import { Image as PhotoIcon } from "lucide-react";
import Image from "next/image";
import { Resizable } from "re-resizable";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { proxyCloudflareReadRequest } from "@/src/client-functions/client-cloudflare/utils";
import useWorkbench, { WorkbenchMode } from "../../zustand";
import ImageSelector from "./image-selector";

export function ElementBody(elementId) {
  const { getElementMetadata, updateElementMetadata, mode } = useWorkbench();
  const [selectorOpen, setSelecorOpen] = useState(false);
  const [image, setImage] = useState<string | undefined>(undefined);
  const [imageSet, setImageSet] = useState(false);
  const { t } = useTranslation("page");

  const [height, setHeight] = useState(
    getElementMetadata(elementId).height ?? 200,
  );

  useEffect(() => {
    const url = getElementMetadata(elementId).imageUrl;
    if (url) {
      setSelecorOpen(false);
      proxyCloudflareReadRequest(url).then((res) => {
        setImage(res);
      });
    }
  }, [imageSet]);

  return (
    <div id={elementId} className="relative flex w-full">
      {selectorOpen && mode === WorkbenchMode.CREATE && (
        <ImageSelector
          elementId={elementId}
          setImageSet={setImageSet}
          setSelecorOpen={setSelecorOpen}
        />
      )}
      {image ? (
        <Resizable
          className="!w-[100%]"
          maxHeight={1000}
          size={{ width: "100%", height: height }}
          onResizeStop={(e, direction, ref, d) => {
            if (direction === "top" || direction === "left") return;
            setHeight(height + d.height);
            const url = getElementMetadata(elementId).imageUrl;
            updateElementMetadata(elementId, {
              imageUrl: url,
              height: height + d.height,
            });
          }}
        >
          <div
            onClick={() => {
              if (mode > 0) return;
              setSelecorOpen(true);
            }}
            className="flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-foreground"
          >
            <span className="text-contrast">Loading...</span>
            <Image
              id={elementId + "-image"}
              src={image}
              fill
              className="h-full w-full rounded-lg object-cover"
              sizes="100%"
              alt={elementId + "-image"}
            />
          </div>
        </Resizable>
      ) : (
        <div
          onClick={() => {
            if (mode > 0) return;
            setSelecorOpen(true);
          }}
          className="flex w-full cursor-pointer items-center rounded-lg bg-background px-4 py-2 text-muted-contrast hover:bg-foreground"
        >
          <PhotoIcon className="mr-3 w-8 text-muted-contrast" />
          <span>{t("workbench.sidebar_element_image_input_placeholder")}</span>
        </div>
      )}
    </div>
  );
}
