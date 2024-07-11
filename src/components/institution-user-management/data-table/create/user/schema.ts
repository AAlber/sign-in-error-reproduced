import { z } from "zod";

export type CreateUserSchema = z.infer<typeof createUserSchema>;
export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email({ message: "invalid_email" }),
});

const optionalDataFields = z.object({
  fields: z
    .object({ fieldId: z.string().optional(), value: z.string().optional() })
    .array()
    .optional(),
});

export const createUserWithDataFieldsSchema =
  createUserSchema.merge(optionalDataFields);

export type CreateUserWithDataFieldsSchema = z.infer<
  typeof createUserWithDataFieldsSchema
>;
