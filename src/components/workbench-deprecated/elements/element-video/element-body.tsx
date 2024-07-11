import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getThumbnailFromYouTubeNoCookieURL } from "../../../../client-functions/client-video";
import useWorkbench, { WorkbenchMode } from "../../zustand";
import VideoSelector from "./video-selector";
import { useVideoSelector } from "./zustand";

export function ElementBody(elementId) {
  const { getElementMetadata, mode } = useWorkbench();
  const { openVideoSelector, setOpenVideoSelector } = useVideoSelector();
  const [videoSet, setVideoSet] = useState(false);
  const { t } = useTranslation("page");

  useEffect(() => {
    if (getElementMetadata(elementId).videoUrl) setOpenVideoSelector(false);
  }, [videoSet]);

  return (
    <div id={elementId} className="relative flex w-full">
      {openVideoSelector && mode === WorkbenchMode.CREATE && (
        <VideoSelector elementId={elementId} setImageSet={setVideoSet} />
      )}
      {getElementMetadata(elementId).videoUrl ? (
        <div className="relative aspect-video w-full">
          <iframe
            src={getElementMetadata(elementId).videoUrl}
            allow="autoplay; encrypted-media"
            className="absolute top-0 z-20 h-full w-full"
            title="video"
          />
          <Image
            id={elementId + "-thumbnail"}
            fill
            priority
            alt="video"
            src={getThumbnailFromYouTubeNoCookieURL(
              getElementMetadata(elementId).videoUrl,
            )}
            className="absolute top-0 aspect-video w-full overflow-hidden rounded-lg object-cover"
          />
        </div>
      ) : (
        <div
          onClick={() => {
            if (mode > 0) return;
            setOpenVideoSelector(true);
          }}
          className="flex w-full cursor-pointer items-center rounded-lg bg-background px-4 py-2 text-muted-contrast hover:bg-foreground"
        >
          <svg
            className="mr-3 h-8 w-8 fill-border"
            xmlns="http://www.w3.org/2000/svg"
            data-name="Layer 1"
            viewBox="0 0 24 24"
          >
            <path d="M23,9.71a8.5,8.5,0,0,0-.91-4.13,2.92,2.92,0,0,0-1.72-1A78.36,78.36,0,0,0,12,4.27a78.45,78.45,0,0,0-8.34.3,2.87,2.87,0,0,0-1.46.74c-.9.83-1,2.25-1.1,3.45a48.29,48.29,0,0,0,0,6.48,9.55,9.55,0,0,0,.3,2,3.14,3.14,0,0,0,.71,1.36,2.86,2.86,0,0,0,1.49.78,45.18,45.18,0,0,0,6.5.33c3.5.05,6.57,0,10.2-.28a2.88,2.88,0,0,0,1.53-.78,2.49,2.49,0,0,0,.61-1,10.58,10.58,0,0,0,.52-3.4C23,13.69,23,10.31,23,9.71ZM9.74,14.85V8.66l5.92,3.11C14,12.69,11.81,13.73,9.74,14.85Z" />
          </svg>
          <span>
            {t("workbench.sidebar_element_youtube_input_placeholder")}
          </span>
        </div>
      )}
    </div>
  );
}
