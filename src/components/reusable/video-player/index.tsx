import { Maximize2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactPlayer from "react-player";
import { convertToEmbedLink } from "@/src/client-functions/client-utils";
import Box from "../box";
import Modal from "../modal";
import { Button } from "../shadcn-ui/button";
import { CardDescription, CardHeader, CardTitle } from "../shadcn-ui/card";
import type { VideoPlayerInitData } from "./zustand";
import useVideoPlayer from "./zustand";

const VideoPlayer = () => {
  const { t } = useTranslation("page");
  const [muted, setMuted] = useState(true);

  const {
    open,
    setOpen,
    showVideoControls,
    status,
    setStatus,
    onClose,
    title,
    description,
    url,
    type,
  } = useVideoPlayer();

  useEffect(() => {
    if (status && !open) onClose(status);
  }, [open]);

  useEffect(() => {
    if (muted)
      setTimeout(() => {
        setMuted(false);
      }, 50);
  }, [muted]);

  const toggleFullScreen = () => {
    const element = document.getElementById("video_player");
    if (!element) {
      return;
    }
    const fullScreen = document.fullscreenElement;
    if (fullScreen) {
      document.exitFullscreen();
    } else {
      element.requestFullscreen();
    }
  };

  return (
    <Modal size="lg" open={open} setOpen={setOpen}>
      <CardHeader className="p-0">
        <CardTitle>{t(title)}</CardTitle>
        <CardDescription className="text-muted-contrast">
          {t(description)}
        </CardDescription>
      </CardHeader>
      {/** The `absolute` positioning is crucial here to allow precise placement of the full-screen toggle button within the modal */}
      <div className="absolute right-10 top-0 py-3">
        <Button variant={"ghost"} onClick={toggleFullScreen}>
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>
      <Box className="mt-4" noPadding>
        {type === "loom" ? (
          <>
            <iframe
              id="video_player"
              className="aspect-video h-full w-full rounded-md"
              src={convertToEmbedLink(url)}
              allowFullScreen
            />
          </>
        ) : (
          <ReactPlayer
            id="video_player"
            onReady={(props) => props.seekTo(status.secondsWatched)}
            playing
            muted={muted}
            onDuration={(duration) =>
              setStatus({
                ...status,
                totalSeconds: duration,
              })
            }
            onProgress={(state) =>
              setStatus({
                ...status,
                secondsWatched: state.playedSeconds,
              })
            }
            width={"100%"}
            controls={showVideoControls}
            url={url}
          />
        )}
      </Box>
    </Modal>
  );
};

type VideoPlayerTriggerProps = VideoPlayerInitData & {
  children: React.ReactNode;
};

export const VideoPlayerTrigger = ({
  title,
  description,
  url,
  type,
  children,
}: VideoPlayerTriggerProps) => {
  const { init } = useVideoPlayer();

  return (
    <div
      onClick={() =>
        init({
          title,
          description,
          url,
          type,
        })
      }
    >
      {children}
    </div>
  );
};
export default VideoPlayer;
