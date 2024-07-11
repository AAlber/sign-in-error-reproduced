import Vimeo from "@u-wave/react-vimeo";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
    <div className="relative flex w-full">
      {openVideoSelector && mode === WorkbenchMode.CREATE && (
        <VideoSelector elementId={elementId} setImageSet={setVideoSet} />
      )}
      {getElementMetadata(elementId).videoUrl ? (
        <div className="relative aspect-video w-full">
          <Vimeo
            video={`${getElementMetadata(elementId).videoUrl}`}
            dnt
            className="absolute top-0 z-20 h-full w-full"
            height={550}
            width={1000}
          />
        </div>
      ) : (
        <div
          onClick={() => {
            if (mode > 0) return;
            setOpenVideoSelector(true);
          }}
          className="flex w-full cursor-pointer items-center rounded-lg bg-background px-4 py-2 text-muted-contrast hover:bg-foreground "
        >
          <svg
            className="mr-3 h-7 w-7 fill-border"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M22.875 10.063c-2.442 5.217-8.337 12.319-12.063 12.319-3.672 0-4.203-7.831-6.208-13.043-.987-2.565-1.624-1.976-3.474-.681l-1.128-1.455c2.698-2.372 5.398-5.127 7.057-5.28 1.868-.179 3.018 1.098 3.448 3.832.568 3.593 1.362 9.17 2.748 9.17 1.08 0 3.741-4.424 3.878-6.006.243-2.316-1.703-2.386-3.392-1.663 2.673-8.754 13.793-7.142 9.134 2.807z" />
          </svg>
          <span>{t("workbench.sidebar_element_vimeo_input_placeholder")}</span>
        </div>
      )}
    </div>
  );
}
