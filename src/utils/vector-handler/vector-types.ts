import type { RecordMetadata } from "@pinecone-database/pinecone";

export type Vector<T extends RecordMetadata = RecordMetadata> = {
  id?: string;
  values: number[];
  metadata?: T;
};

export type VectorWithId<T extends RecordMetadata = RecordMetadata> = {
  id: string;
  values: number[];
  metadata?: T;
};
