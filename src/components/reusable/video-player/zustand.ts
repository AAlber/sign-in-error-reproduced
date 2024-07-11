import { create } from "zustand";

export type VideoPlayerStatus = {
  secondsWatched: number;
  totalSeconds: number;
};

export type VideoPlayerInitData = {
  title: string;
  description: string;
  url: string;
  type: SupportedVideoType;
  showVideoControls?: boolean;
  status?: VideoPlayerStatus;
  onClose?: (status: VideoPlayerStatus) => void;
  isDisabled?: (status: VideoPlayerStatus) => boolean;
};

type VideoPlayer = {
  open: boolean;
  init: (data: VideoPlayerInitData) => void;
  setOpen: (open: boolean) => void;
  onClose: (status: VideoPlayerStatus) => void;
  setStatus: (status: VideoPlayerStatus) => void;
  url: string;
  title: string;
  description: string;
  showVideoControls: boolean;
  status: VideoPlayerStatus;
  type: SupportedVideoType;
};

const useVideoPlayer = create<VideoPlayer>()((set, get) => ({
  open: false,
  url: "",
  title: "",
  description: "",
  customFooter: null,
  buttons: [],
  status: {
    hasFinished: false,
    secondsWatched: 0,
    totalSeconds: 0,
  },
  showVideoControls: true,
  type: "youtube" as SupportedVideoType,
  onClose: () => {
    return;
  },
  isDisabled: () => false,
  setOpen: (open) => set(() => ({ open })),
  setStatus: (status) => set(() => ({ status })),
  init: (data) => set(() => ({ ...data, open: true })),
}));

export default useVideoPlayer;
