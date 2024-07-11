import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import useAudioPlayer from "@/src/components/reusable/audio-player/audio-player";
import type { ContentBlock } from "../../../course.types";
import type { ContentBlockUserStatusOfUser } from "../../types/user-data.types";

export function openAudio(
  block: ContentBlock<"Audio">,
  userStatus: ContentBlockUserStatusOfUser<"Audio">,
) {
  const { init } = useAudioPlayer.getState();

  init({
    title: block.name,
    description: block.description,
    url: block.specs.audioFileUrl,
    type: block.specs.type,
    // We start the video at the last watched position.
    // If the user has not watched the video yet, we start at the beginning.
    status: {
      secondsListened: !userStatus.userData
        ? 0
        : (userStatus.userData as any).secondsListened,
      totalSeconds: 0,
    },

    // We will update the user status when the video player is closed.
    onClose: async (status) => {
      if (!status) return;
      const listenPercentage =
        (status.secondsListened / status.totalSeconds) * 100;

      // If the user has finished the video, we will consider the video as finished
      // even if the user now seeks back to the beginning of the video.
      // He may want to rewatch the video.
      if (userStatus.status === "FINISHED")
        return contentBlockHandler.userStatus.update<"Audio">({
          blockId: block.id,
          data: {
            status: "FINISHED",
            userData: {
              listenedPercentage:
                listenPercentage > 90 ? 100 : listenPercentage,
              lastListenedAt: new Date(),
              secondsListened: status.secondsListened,
            },
          },
        });

      // If the user has not finished the video, we will consider the video as in progress
      // as long as the user has watched no more than 90% of the video.
      // If the user has watched more than 90% of the video, we will consider the video as finished.

      if (listenPercentage > 90) {
        await contentBlockHandler.userStatus.finish<"Audio">(block.id, {
          listenedPercentage: 100,
          lastListenedAt: new Date(),
          secondsListened: status.secondsListened,
        });
      } else {
        await contentBlockHandler.userStatus.update<"Audio">({
          blockId: block.id,
          data: {
            status: "IN_PROGRESS",
            userData: {
              listenedPercentage: listenPercentage,
              lastListenedAt: new Date(),
              secondsListened: status.secondsListened,
            },
          },
        });
      }
    },
  });
}
