import { AudioLines } from "lucide-react";
import mime from "mime";
import { fetchDropFieldDownloadUrls } from "@/src/client-functions/client-cloudflare";
import useContentBlockModal from "@/src/components/course/content-blocks/content-block-creator/zustand";
import { ContentBlockBuilder } from "../../registry";
import { openAudio } from "./open-audio";

const audio = new ContentBlockBuilder("Audio")
  .withName("audio")
  .withCategory("InfoMaterials")
  .withDescription("audio-description")
  .withPopoverSettings({ hasOpenButton: true, hasMarkAsFinishedButton: true })
  .withHint("audio_hint")
  .withPreCreationStep(async () => {
    const { data, setData } = useContentBlockModal.getState();
    const urls = await fetchDropFieldDownloadUrls();
    if (!urls || urls.length === 0)
      throw new Error("Error uploading audio file");
    setData<"Audio">({
      audioFileUrl: urls[0],
      type: (mime.getType(urls[0]) || ".mp3") as SupportedAudioType,
    });
  })
  .withForm({
    audioFileUrl: {
      label: "file",
      description: "audio_upload_description",
      fieldType: "file",
      allowedFileTypes: ["audio/*"],
    },
    type: {
      fieldType: "custom",
      label: "audio_format",
    },
  })
  .withStyle({
    icon: <AudioLines className="h-4 w-4" />,
  })
  .withOpeningProcedure((block, userStatus) =>
    openAudio(block, userStatus as any),
  )
  .build();

export default audio;
