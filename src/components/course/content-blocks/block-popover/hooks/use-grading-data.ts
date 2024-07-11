import type { ContentBlockUserGrading } from "@prisma/client";
import { useEffect, useState } from "react";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import type { ContentBlock } from "@/src/types/course.types";
import type { UserData } from "@/src/types/user-data.types";

export function useGradingData({
  block,
  user,
}: {
  block: ContentBlock;
  user: UserData;
}) {
  const [grading, setGrading] = useState<ContentBlockUserGrading>();
  const [graderProfile, setGraderProfile] =
    useState<Pick<SimpleUser, "name" | "image" | "id">>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    contentBlockHandler.userStatus
      .getForUser({ blockId: block.id, userId: user.id })
      .then((p) => {
        setLoading(false);
        setGrading(p.rating);
        setGraderProfile(p.graderProfile);
      });
  }, [block.id, user.id]);

  return { grading, graderProfile, loading };
}
