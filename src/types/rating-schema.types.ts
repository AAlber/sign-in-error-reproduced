import type { RatingSchema, RatingSchemaValue } from "@prisma/client";

export interface CreateRatingSchema {
  name: string;
}

export interface UpdateRatingSchema {
  id: string;
  name: string;
  passPercentage: number;
  default: boolean;
}

export interface DeleteRatingSchema {
  id: string;
}

export interface ServerCreateRatingSchema extends CreateRatingSchema {
  institutionId: string;
}

export type ServerUpdateRatingSchema = UpdateRatingSchema & {
  institutionId: string;
};

export type ServerDeleteRatingSchema = DeleteRatingSchema;

export interface ServerGetRatingSchemas {
  institutionId: string;
}

export type CreateRatingSchemaValue = {
  ratingSchemaId: string;
  name: string;
  min: number;
  max: number;
};

export type UpdateRatingSchemaValue = {
  id: string;
  ratingSchemaId: string;
  name: string;
  min: number;
  max: number;
};

export type RatingSchemaWithValues = RatingSchema & {
  values: RatingSchemaValue[];
};

export type DeleteRatingSchemaValue = { id: string };

export type GetRatingSchemaValues = { ratingSchemaId: string };

export type ServerCreateRatingSchemaValue = CreateRatingSchemaValue;
export type ServerUpdateRatingSchemaValue = UpdateRatingSchemaValue;
export type ServerDeleteRatingSchemaValue = DeleteRatingSchemaValue;
export type ServerGetRatingSchemaValues = GetRatingSchemaValues;
