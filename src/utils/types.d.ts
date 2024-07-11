type Pagination = {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
};

type UnsplashImage = {
  thumb: string;
  full: string;
  regular: string;
};

type SimpleUser = {
  id: string;
  name: string;
  image: string | null;
  email: string;
};

type SupportedVideoType = "youtube" | "loom" | "vimeo";

type SupportedAudioType =
  | ".mp3"
  | ".mp4"
  | ".wav"
  | ".ogg"
  | ".flac"
  | ".aac"
  | ".wma"
  | ".m4a"
  | ".midi"
  | ".alac";
