import { S3Client } from "@aws-sdk/client-s3";
import type { NodeJsClient } from "@smithy/types";

export const R2 = new S3Client({
  region: "auto",
  endpoint: process.env.NEXT_PUBLIC_R2_S3_API as string,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_KEY_ID!,
  },
}) as NodeJsClient<S3Client>;
