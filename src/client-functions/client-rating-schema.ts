import type { RatingSchema, RatingSchemaValue } from "@prisma/client";
import { toast } from "../components/reusable/toaster/toast";
import api from "../pages/api/api";
import type {
  CreateRatingSchema,
  CreateRatingSchemaValue,
  DeleteRatingSchema,
  DeleteRatingSchemaValue,
  GetRatingSchemaValues,
  RatingSchemaWithValues,
  UpdateRatingSchema,
  UpdateRatingSchemaValue,
} from "../types/rating-schema.types";

export async function createRatingSchema(data: CreateRatingSchema) {
  const response = await fetch(api.createRatingSchema, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    toast.responseError({ response });
    return null;
  }

  const responseData = await response.json();
  return responseData as Readonly<RatingSchema>;
}

export async function updateRatingSchema(data: UpdateRatingSchema) {
  const response = await fetch(api.updateRatingSchema, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    toast.responseError({ response });
    return null;
  }

  const responseData = await response.json();
  return responseData as Readonly<RatingSchema>;
}

export async function deleteRatingSchema(data: DeleteRatingSchema) {
  const response = await fetch(api.deleteRatingSchema, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    toast.responseError({ response });
    return null;
  }

  const responseData = await response.json();
  return responseData as Readonly<RatingSchema>;
}

export async function getRatingSchemas() {
  const response = await fetch(api.getRatingSchemas, {
    method: "GET",
  });

  if (!response.ok) {
    toast.responseError({ response });
    return null;
  }

  const responseData = await response.json();
  return responseData as RatingSchemaWithValues[];
}

export async function createRatingSchemaValue(data: CreateRatingSchemaValue) {
  const response = await fetch(api.createRatingSchemaValue, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    toast.responseError({ response });
  }
  const responseData = await response.json();
  return responseData as Readonly<RatingSchemaValue>;
}

export async function updateRatingSchemaValue(data: UpdateRatingSchemaValue) {
  const response = await fetch(api.updateRatingSchemaValue, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    toast.responseError({ response });
  }
  const responseData = await response.json();
  return responseData as Readonly<RatingSchemaValue>;
}

export async function deleteRatingSchemaValue(data: DeleteRatingSchemaValue) {
  const response = await fetch(api.deleteRatingSchemaValue, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    toast.responseError({ response });
  }
  const responseData = await response.json();
  return responseData as Readonly<RatingSchemaValue>;
}

export async function getRatingSchemaValues(
  data: GetRatingSchemaValues,
): Promise<RatingSchemaValue[]> {
  const response = await fetch(
    `${api.getRatingSchemaValues}?ratingSchemaId=${data.ratingSchemaId}`,
    { method: "GET" },
  );
  if (!response.ok) {
    toast.responseError({ response });
  }
  const responseData = await response.json();
  return responseData as RatingSchemaValue[];
}
