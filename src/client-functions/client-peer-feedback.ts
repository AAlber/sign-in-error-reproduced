import type { Prisma } from "@prisma/client";
import * as Sentry from "@sentry/browser";
import cuid from "cuid";
import { toast } from "../components/reusable/toaster/toast";
import api from "../pages/api/api";

export async function createPeerFeedback(
  userId: string,
  layerId: string,
  text: string,
  rating: number,
) {
  try {
    const response = await fetch(api.createPeerFeedback, {
      method: "POST",
      body: JSON.stringify({ userId, layerId, text, rating }),
    });

    if (!response.ok) {
      throw new Error("Failed to create peer feedback");
    }

    return await response.json();
  } catch (error) {
    Sentry.captureException(error, {
      extra: { userId, layerId, text, rating },
    });
  }
}

export async function deletePeerFeedback(id: string) {
  try {
    const response = await fetch(api.deletePeerFeedback + id, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete peer feedback");
    }

    return await response.json();
  } catch (error) {
    Sentry.captureException(error, {
      extra: { id },
    });
    throw error;
  }
}

export type UserWithPeerFeedback = SimpleUser & {
  feedbacks: Prisma.PeerFeedbackGetPayload<{
    select: {
      id: true;
      userId: true;
      rating: true;
      reviewerId: true;
    };
  }>[];
};

export async function getUsersOfCourseWithPeerFeedback(
  layerId: string,
): Promise<UserWithPeerFeedback[]> {
  const response = await fetch(api.getPeerFeedback + layerId, {
    method: "GET",
  });

  if (!response.ok) {
    Sentry.captureException(new Error("Failed to fetch peer feedback"), {
      extra: {
        response,
        layerId,
      },
    });
    return [];
  }
  return await response.json();
}

export type PeerFeedbacksOfUser = Prisma.PeerFeedbackGetPayload<{
  select: {
    id: true;
    userId: true;
    text: true;
    rating: true;
    createdAt: true;
    updatedAt: true;
    reviewer: true;
  };
}>;

export async function getPeerFeedbacksOfUser(
  layerId: string,
  userId: string,
): Promise<PeerFeedbacksOfUser[]> {
  const response = await fetch(
    `${api.getPeerFeedbacksOfUser}?layerId=${layerId}&targetUserId=${userId}`,
    {
      method: "GET",
    },
  );

  if (!response.ok) {
    Sentry.captureException(new Error("Cannot get peer feedbacks of user."), {
      extra: {
        layerId,
        userId,
        response,
      },
    });
    toast.responseError({ response });
  }

  return await response.json();
}

export async function getPeerFeedbackGivenToUser(
  layerId: string,
  userId: string,
  reviewerId: string,
): Promise<PeerFeedbacksOfUser | null> {
  const response = await fetch(
    `${api.getPeerFeedbackGivenToUser}?layerId=${layerId}&targetUserId=${userId}&reviewerId=${reviewerId}`,
    {
      method: "GET",
    },
  );

  if (!response.ok) {
    Sentry.captureException(
      new Error("Cannot get peer feedback given to user."),
      {
        extra: {
          layerId,
          userId,
          response,
        },
      },
    );
    toast.responseError({ response });
  }

  return await response.json();
}

export const updatePeerFeedback = (
  data: UserWithPeerFeedback[],
  userWithPeerFeedback: { id: string; name: string }, // Defina este tipo corretamente
  user: { id: string; name: string }, // Defina este tipo corretamente
  feedback: string,
  rating: number,
  setData: (data: UserWithPeerFeedback[]) => void,
  setIsOpen: (isOpen: boolean) => void,
  setLoading: (loading: boolean) => void,
) => {
  setLoading(true);

  const existingFeedbackIndex = data.findIndex((d) =>
    d.feedbacks.some(
      (fb) =>
        fb.reviewerId === user.id && fb.userId === userWithPeerFeedback.id,
    ),
  );

  const newData: any = [...data];

  if (existingFeedbackIndex >= 0) {
    const updatedFeedbacks = newData[existingFeedbackIndex]!.feedbacks.map(
      (fb) => {
        if (
          fb.reviewerId === user.id &&
          fb.userId === userWithPeerFeedback.id
        ) {
          return { ...fb, text: feedback, rating };
        }
        return fb;
      },
    );

    newData[existingFeedbackIndex] = {
      ...newData[existingFeedbackIndex],
      feedbacks: updatedFeedbacks,
    };
  } else {
    const newUserFeedback = {
      id: cuid(),
      userId: userWithPeerFeedback.id,
      text: feedback,
      rating,
      reviewerId: user.id,
    };

    const updatedUserIndex = newData.findIndex(
      (d) => d.id === userWithPeerFeedback.id,
    );
    newData[updatedUserIndex] = {
      ...newData[updatedUserIndex],
      feedbacks: [...newData[updatedUserIndex].feedbacks, newUserFeedback],
    };
  }

  setData(newData);
  setIsOpen(false);
  setLoading(false);
};
