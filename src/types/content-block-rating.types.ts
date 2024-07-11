/** @deprecated use ContentBlockUserGrading model */

export type CreateContentBlockRating = {
  ratingLabel: string;
  min: number;
  max: number;
  passed: boolean;
  userId: string;
  blockId: string;
  layerId: string;
  schemaName: string;
};

export type UpdateContentBlockRating = {
  id: string;
  ratingLabel?: string;
  min?: number;
  max?: number;
  passed?: boolean;
  layerId: string;
  schemaName?: string;
};

export type DeleteContentBlockRating = {
  id: string;
};

export type GetContentBlockRating = {
  id: string;
};

export type ServerCreateContentBlockRating = CreateContentBlockRating & {
  institutionId: string;
};
export type ServerUpdateContentBlockRating = UpdateContentBlockRating;
export type ServerDeleteContentBlockRating = DeleteContentBlockRating;
export type ServerGetContentBlockRating = GetContentBlockRating;
