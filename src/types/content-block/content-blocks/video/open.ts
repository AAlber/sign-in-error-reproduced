import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import useVideoPlayer from "@/src/components/reusable/video-player/zustand";
import type { ContentBlock } from "../../../course.types";
import type { ContentBlockUserStatusOfUser } from "../../types/user-data.types";

export function openVideo(
  block: ContentBlock<"Video">,
  userStatus: ContentBlockUserStatusOfUser<"Video">,
) {
  const { init } = useVideoPlayer.getState();

  init({
    title: block.name,
    description: block.description,
    url: block.specs.videoUrl,
    type: block.specs.type,
    showVideoControls: block.specs.showVideoControls,
    // We start the video at the last watched position.
    // If the user has not watched the video yet, we start at the beginning.
    status: {
      secondsWatched: !userStatus.userData
        ? 0
        : (userStatus.userData as any).secondsWatched,
      totalSeconds: 0,
    },

    // We will update the user status when the video player is closed.
    onClose: async (status) => {
      if (!status) return;
      const watchedPercentage =
        (status.secondsWatched / status.totalSeconds) * 100;

      // If the user has finished the video, we will consider the video as finished
      // even if the user now seeks back to the beginning of the video.
      // He may want to rewatch the video.
      if (userStatus.status === "FINISHED")
        return contentBlockHandler.userStatus.update<"Video">({
          blockId: block.id,
          data: {
            status: "FINISHED",
            userData: {
              watchedPercentage:
                watchedPercentage > 90 ? 100 : watchedPercentage,
              lastWatchedAt: new Date(),
              secondsWatched: status.secondsWatched,
            },
          },
        });

      // If the user has not finished the video, we will consider the video as in progress
      // as long as the user has watched no more than 90% of the video.
      // If the user has watched more than 90% of the video, we will consider the video as finished.

      if (watchedPercentage > 90) {
        await contentBlockHandler.userStatus.finish<"Video">(block.id, {
          watchedPercentage: 100,
          lastWatchedAt: new Date(),
          secondsWatched: status.secondsWatched,
        });
      } else {
        await contentBlockHandler.userStatus.update<"Video">({
          blockId: block.id,
          data: {
            status: "IN_PROGRESS",
            userData: {
              watchedPercentage: watchedPercentage,
              lastWatchedAt: new Date(),
              secondsWatched: status.secondsWatched,
            },
          },
        });
      }
    },
  });
}
