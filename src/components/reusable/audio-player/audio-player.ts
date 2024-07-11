import { create } from "zustand";

export type AudioPlayerStatus = {
  secondsListened: number;
  totalSeconds: number;
  currentTime?: number;
};

export type AudioPlayerInitData = {
  title: string;
  description: string;
  url: string;
  type: string;
  status?: AudioPlayerStatus;
  listenedPercentage?: number;
  onClose?: (status: AudioPlayerStatus) => void;
};

type AudioPlayerStore = {
  open: boolean;
  onClose: (status: AudioPlayerStatus) => void;
  setOpen: (open: boolean) => void;
  init: (data: AudioPlayerInitData) => void;
  setStatus: (status: AudioPlayerStatus) => void;
  updatePlaybackTime: (currentTime: number, duration: number) => void;
  url: string;
  title: string;
  description: string;
  type: string;
  status: AudioPlayerStatus;
};

const useAudioPlayer = create<AudioPlayerStore>((set, get) => ({
  open: false,
  url: "",
  title: "",
  description: "",
  type: ".mp3",
  status: {
    secondsListened: 0,
    totalSeconds: 0,
    currentTime: 0,
  },
  onClose: () => {
    return;
  },
  setOpen: (open) => set({ open }),
  setStatus: (status) => set(() => ({ status })),
  init: (data) => {
    set({
      ...data,
      open: true,
      onClose: data.onClose || get().onClose,
    });
  },
  updatePlaybackTime: (currentTime, duration) => {
    const { status } = get();
    set({
      status: {
        ...status,
        secondsListened: currentTime,
        totalSeconds: duration,
      },
    });
  },
}));

export default useAudioPlayer;
