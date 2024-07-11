import { useEffect, useState } from "react";
import api from "@/src/pages/api/api";
import { log } from "@/src/utils/logger/logger";
import useCourse from "../../zustand";

const useFetchUserStatus = () => {
  const [loadingUserStatus, setLoadingUserStatus] = useState(true);
  const { course, contentBlocks, setContentBlocks } = useCourse();

  useEffect(() => {
    if (!course.layer_id || contentBlocks.length < 1) return;

    const url = new URL(api.getContentBlockUserStatus, window.location.origin);
    url.searchParams.append("layerId", course.layer_id);

    fetch(url)
      .then(async (res) => {
        const data = await res.json();

        const contentBlocksWithUserData = contentBlocks.map((block) => {
          const userStatus = data.find((d) => d.id === block.id)?.userStatus;
          return {
            ...block,
            userStatus: userStatus || block.userStatus,
          };
        });

        setContentBlocks(contentBlocksWithUserData);
        setLoadingUserStatus(false);
      })
      .catch((err) => {
        log.error(err, "Error fetching content block user data");
        setLoadingUserStatus(false);
      });
  }, [course.layer_id, contentBlocks.length]);

  return { loadingUserStatus };
};

export default useFetchUserStatus;
