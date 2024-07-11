import type {
  ServerCreateRatingSchema,
  ServerCreateRatingSchemaValue,
  ServerDeleteRatingSchema,
  ServerDeleteRatingSchemaValue,
  ServerGetRatingSchemas,
  ServerGetRatingSchemaValues,
  ServerUpdateRatingSchema,
  ServerUpdateRatingSchemaValue,
} from "@/src/types/rating-schema.types";
import { prisma } from "../db/client";

export async function createRatingSchema(data: ServerCreateRatingSchema) {
  const schemas = await getRatingSchemasWithoutValues({
    institutionId: data.institutionId,
  });
  if (schemas.length === 0 || schemas.filter((s) => s.default).length === 0) {
    return await prisma.ratingSchema.create({
      data: { ...data, default: true },
    });
  }
  return await prisma.ratingSchema.create({ data: { ...data } });
}

export async function getRatingSchemas(data: ServerGetRatingSchemas) {
  return await prisma.ratingSchema.findMany({
    where: { institutionId: data.institutionId },
    include: { values: true },
  });
}

export async function getRatingSchemasWithoutValues(
  data: ServerGetRatingSchemas,
) {
  return await prisma.ratingSchema.findMany({
    where: { institutionId: data.institutionId },
  });
}

export async function updateRatingSchema(data: ServerUpdateRatingSchema) {
  if (data.default) {
    const schemas = await getRatingSchemasWithoutValues({
      institutionId: data.institutionId,
    });
    const promises = schemas.map((schema) => {
      return prisma.ratingSchema.update({
        where: { id: schema.id },
        data: { default: false },
      });
    });
    await Promise.all(promises);
  }

  return await prisma.ratingSchema.update({
    where: { id: data.id },
    data: {
      name: data.name,
      passPercentage: data.passPercentage,
      default: data.default,
    },
  });
}

export async function deleteRatingSchema(data: ServerDeleteRatingSchema) {
  return await prisma.ratingSchema.delete({
    where: { id: data.id },
  });
}

export async function createRatingSchemaValue(
  data: ServerCreateRatingSchemaValue,
) {
  return await prisma.ratingSchemaValue.create({ data });
}

export async function getRatingSchemaValues(data: ServerGetRatingSchemaValues) {
  return await prisma.ratingSchemaValue.findMany({
    where: { ratingSchemaId: data.ratingSchemaId },
  });
}

export async function updateRatingSchemaValue(
  data: ServerUpdateRatingSchemaValue,
) {
  return await prisma.ratingSchemaValue.update({
    where: { id: data.id },
    data: {
      ratingSchemaId: data.ratingSchemaId,
      name: data.name,
      min: data.min,
      max: data.max,
    },
  });
}

export async function deleteRatingSchemaValue(
  data: ServerDeleteRatingSchemaValue,
) {
  return await prisma.ratingSchemaValue.delete({ where: { id: data.id } });
}
