import { FeedbackRatingEnum } from "@prisma/client";

export type Rating = {
  name: string;
  emoji: string;
  score: FeedbackRatingEnum;
  rating: number;
};

export const emojis: Rating[] = [
  {
    name: "love",
    emoji: "😍",
    score: FeedbackRatingEnum.EXCELLENT,
    rating: 5,
  },
  {
    name: "happy",
    emoji: "😁",
    score: FeedbackRatingEnum.ABOVE_AVERAGE,
    rating: 4,
  },
  {
    name: "neutral",
    emoji: "😌",
    score: FeedbackRatingEnum.AVERAGE,
    rating: 3,
  },
  {
    name: "sad",
    emoji: "😕",
    score: FeedbackRatingEnum.BELOW_AVERAGE,
    rating: 2,
  },
  {
    name: "cry",
    emoji: "😭",
    score: FeedbackRatingEnum.VERY_POOR,
    rating: 1,
  },
];
