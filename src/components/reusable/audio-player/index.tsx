import { Pause, Play } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useEffect, useRef, useState } from "react";
import { AudioVisualizer } from "react-audio-visualize";
import { useTranslation } from "react-i18next";
import { proxyCloudflareReadRequest } from "@/src/client-functions/client-cloudflare/utils";
import { getCurrentTheme } from "@/src/client-functions/client-institution-theme";
import Spinner from "@/src/components/spinner";
import useThemeStore from "../../dashboard/navigation/primary-sidebar/user-menu/theme-switcher/zustand";
import Modal from "../modal";
import { Button } from "../shadcn-ui/button";
import { CardDescription, CardHeader, CardTitle } from "../shadcn-ui/card";
import useAudioPlayer from "./audio-player";

const AudioPlayer = () => {
  const { t } = useTranslation("page");
  const { open, setOpen, url, title, description, status, onClose } =
    useAudioPlayer();
  const [blob, setBlob] = useState<Blob | null>(null);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  const audioRef = useRef(new Audio(url));
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const { instiTheme } = useThemeStore();
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const savedTime = parseFloat(localStorage.getItem("savedAudioTime") || "0");
    if (savedTime) {
      audioRef.current.currentTime = savedTime;
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audioRef.current.currentTime);
    };

    audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
    audioRef.current.addEventListener("ended", () => setFinished(true));

    return () => {
      audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
      audioRef.current.removeEventListener("ended", () => setFinished(false));
      localStorage.setItem(
        "savedAudioTime",
        audioRef.current.currentTime.toString(),
      );
    };
  }, []);

  useEffect(() => {
    if (url) {
      proxyCloudflareReadRequest(url).then((signedUrl) => {
        setSignedUrl(signedUrl);
        fetch(signedUrl)
          .then((res) => {
            if (!res.ok) {
              throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.blob();
          })
          .then((blob) => {
            setBlob(blob);
            const objectURL = URL.createObjectURL(blob);
            audioRef.current.src = objectURL;
          });
      });
    }
  }, [url]);

  useEffect(() => {
    if (status && !open) {
      onClose({
        secondsListened: currentTime,
        totalSeconds: audioRef.current.duration,
        currentTime: currentTime,
      });
    }
  }, [open]);

  useEffect(() => {
    if (!open && playing) {
      audioRef.current.pause();
      localStorage.setItem(
        "savedAudioTime",
        audioRef.current.currentTime.toString(),
      );

      setPlaying(false);
      setFinished(false);
    }
  }, [open, playing]);

  const togglePlay = () => {
    if (finished) {
      audioRef.current.currentTime = 0;
      setFinished(false);
    }
    const isPlaying = !playing;
    setPlaying(isPlaying);
    isPlaying ? audioRef.current.play() : audioRef.current.pause();
  };

  const seek = (event) => {
    const visualizerWidth = event.currentTarget.clientWidth;
    const clickPosition = event.nativeEvent.offsetX;
    const seekPercentage = clickPosition / visualizerWidth;
    const seekTime = seekPercentage * audioRef.current.duration;
    audioRef.current.currentTime = seekTime;
    localStorage.setItem("savedAudioTime", seekTime.toString());
  };

  function getBarColor(type) {
    const isDark = resolvedTheme === "dark";
    const colorType = isDark ? "dark" : "light";
    const colorVariant = type === "played" ? "primary" : "muted";
    return `hsl(${
      getCurrentTheme(instiTheme)!.cssVars[colorType][colorVariant]
    })`;
  }

  return (
    <Modal size="lg" open={open} setOpen={setOpen}>
      <CardHeader className="p-2">
        <CardTitle>{t(title)}</CardTitle>
        <CardDescription>{t(description)}</CardDescription>
      </CardHeader>

      {url && blob && audioRef && signedUrl ? (
        <div className="flex flex-col gap-4 p-2">
          <div className="flex flex-row gap-4">
            <Button
              variant={"ghost"}
              onClick={togglePlay}
              className="mt-5 text-muted-contrast"
            >
              {finished ? <Play /> : playing ? <Pause /> : <Play />}
            </Button>
            <div className={`cursor-pointer`} onClick={seek}>
              <AudioVisualizer
                blob={blob}
                ref={canvasRef}
                width={650}
                height={75}
                barWidth={1}
                gap={1}
                barColor={getBarColor("unplayed")}
                barPlayedColor={getBarColor("played")}
                currentTime={currentTime}
              />
            </div>
          </div>
          <p className="text-xs italic text-muted-contrast">
            {t("audio_saved_time_played")}
          </p>
        </div>
      ) : (
        <Spinner className="ml-2 h-4 w-4" />
      )}
    </Modal>
  );
};

export default AudioPlayer;
