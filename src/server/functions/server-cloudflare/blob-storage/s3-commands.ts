import type { PutObjectCommandInput } from "@aws-sdk/client-s3";
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getKeyFromUrl } from "@/src/client-functions/client-cloudflare/utils";
import { log } from "@/src/utils/logger/logger";
import { decodeAndGetKey } from "../utils";

export class S3Commands {
  private bucketName = process.env.NEXT_PUBLIC_R2_BUCKET_NAME;

  get(key: string): GetObjectCommand {
    return new GetObjectCommand({
      Bucket: this.bucketName,
      Key: decodeAndGetKey(key),
    });
  }

  put(
    key: string,
    data?: Omit<PutObjectCommandInput, "Bucket" | "Key">,
  ): PutObjectCommand {
    return new PutObjectCommand({
      Bucket: this.bucketName,
      Key: decodeAndGetKey(key),
      ...data,
    });
  }

  list(prefix: string, continuationToken?: string): ListObjectsV2Command {
    log.info("list command prefix", decodeAndGetKey(prefix)).cli();
    return new ListObjectsV2Command({
      Bucket: this.bucketName,
      Prefix: decodeAndGetKey(prefix),
      ContinuationToken: continuationToken,
    });
  }

  delete(key: string): DeleteObjectCommand {
    log.info("delete command key", decodeAndGetKey(key)).cli();
    return new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: decodeAndGetKey(key),
    });
  }

  copy(sourceKey: string, destinationKey: string): CopyObjectCommand {
    const encodedSourceKey = getKeyFromUrl(sourceKey)
      .split("/")
      .map(encodeURIComponent)
      .join("/");
    const fullSourcePath = `${this.bucketName}/${encodedSourceKey}`;
    log
      .info("Copying file", { sourceKey, destinationKey, fullSourcePath })
      .cli();

    return new CopyObjectCommand({
      Bucket: this.bucketName,
      CopySource: fullSourcePath,
      Key: destinationKey,
    });
  }
}

export const s3Commands = new S3Commands();
