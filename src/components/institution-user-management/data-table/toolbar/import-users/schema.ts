import { z } from "zod";
import { mapObjectToLowercaseKeys } from "@/src/utils/utils";
import {
  type CreateUserSchema,
  createUserSchema,
} from "../../create/user/schema";

export type ImportUserFieldType = CreateUserSchema &
  WithGroupColumn & {
    [customField: string]: string;
  };

export type ImportUserFieldsType = ImportUserFieldType[];

const withGroupColumn = z.object({ group: z.string().optional() });
type WithGroupColumn = z.infer<typeof withGroupColumn>;

const anyObjectSchema = z.record(z.string(), z.any());
const lowercaseKeysSchema = anyObjectSchema.transform((obj) =>
  mapObjectToLowercaseKeys(obj),
);

/**
 * transform all keys to lowercase,
 * this will accept User or EMAIL then transform to user/email
 * then continue validation
 */
export const importUsersSchema = lowercaseKeysSchema
  .pipe(createUserSchema.merge(withGroupColumn))
  .array();
