import type {
  Index,
  QueryResponse,
  RecordMetadata,
} from "@pinecone-database/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import Sentry from "@sentry/nextjs";
import cuid from "cuid";
import type { Vector, VectorWithId } from "./vector-types";

const STANDARD_DIMENSIONS = 1536;
const STANDARD_METRIC = "cosine";

/**
 * This class is responsible for managing vector storage operations with our Vectordatabase Provider.
 * It allows the creation and handling of indexes for storing and retrieving vector data.
 */
class VectorStorageHandler {
  private _pinecone: Pinecone;

  /**
   * Initializes the VectorStorageHandler with a predefined Provider configuration.
   * Sets up the Vectordatabase Provider client with the provided API key.
   */
  constructor() {
    this._pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY || "",
    });
  }

  /**
   * Creates and returns an instance of IndexedVectorStorageHandler for managing a specific index.
   * @param {string} index - The name of the index to be managed.
   * @returns {IndexedVectorStorageHandler} An instance of IndexedVectorStorageHandler.
   */
  index(index: string): IndexedVectorStorageHandler {
    return new IndexedVectorStorageHandler(index, this._pinecone);
  }

  /**
   * Creates a new index in the Vector database and returns its handler.
   * @param {string} index - The name of the new index to create.
   * @returns {Promise<IndexedVectorStorageHandler>} A promise that resolves to the handler of the newly created index.
   */
  async createIndex(index: string): Promise<IndexedVectorStorageHandler> {
    await this._pinecone.createIndex({
      name: index,
      dimension: STANDARD_DIMENSIONS,
      metric: STANDARD_METRIC,
      waitUntilReady: true,
      spec: {
        serverless: {
          cloud: "aws",
          region: "us-west-2",
        },
      },
    });

    return this.index(index);
  }
}

/**
 * This class handles operations on a specific Vectordatabase index.
 * It provides methods to insert, update, query, and delete vectors in the index.
 */
class IndexedVectorStorageHandler {
  private _pinecone: Pinecone;
  private _indexName: string;
  private _index: Index<RecordMetadata>;
  private _namespace = "";

  /**
   * Initializes the handler for a specific Vectordatabase index.
   * @param {string} index - The name of the index to be managed.
   * @param {Pinecone} pinecone - The Vectordatabase instance to interact with the database.
   */
  constructor(index: string, pinecone: Pinecone) {
    this._pinecone = pinecone;
    this._index = pinecone.Index(index);
    this._indexName = index;
  }

  /**
   * Adds a unique identifier (CUID) to each vector in the array if not already present.
   * @param {Vector[]} vectors - An array of vectors.
   * @returns {VectorWithId[]} An array of vectors, each with a unique identifier.
   */
  private addCuidToVectors<T extends RecordMetadata = RecordMetadata>(
    vectors: Vector<T>[],
  ): VectorWithId<T>[] {
    return vectors.map((vector) => {
      if (vector.id) return vector as VectorWithId<T>;
      return {
        id: cuid(),
        values: vector.values,
        metadata: vector.metadata,
      };
    });
  }

  /**
   * Retrieves the index configured with or without a namespace.
   * @returns {Index<RecordMetadata>} The configured index.
   */
  private getIndexWithNamespace(): Index<RecordMetadata> {
    return this._namespace
      ? this._index.namespace(this._namespace)
      : this._index;
  }

  /**
   * Sets a namespace for subsequent operations on the index.
   * This allows for logical separation within the same index.
   * @param {string} namespace - The namespace to set for future operations.
   * @returns {IndexedVectorStorageHandler} The current instance for method chaining.
   */
  namespace(namespace: string): IndexedVectorStorageHandler {
    this._namespace = namespace;
    return this;
  }

  /**
   * Queries the Vectordatabase index using either a vector or an ID.
   * @param {{ vector: number[]; topK: number } | { id: string; topK: number }} data - The query data, either a vector or an ID.
   * @returns {Promise<QueryResponse<RecordMetadata>>} A promise that resolves to the query results.
   */
  async query(
    data: { vector: number[]; topK: number } | { id: string; topK: number },
  ): Promise<QueryResponse<RecordMetadata>> {
    try {
      return await this.getIndexWithNamespace().query({
        ...data,
        includeMetadata: true,
      });
    } catch (error) {
      console.error("Error during querying the index: ", error);
      Sentry.captureException(error, {
        level: "error",
        extra: { queryData: data },
      });
      throw error;
    }
  }

  /**
   * Inserts or updates vectors in the Vectordatabase index.
   * @param {Vector[]} vectors - An array of vectors to upsert.
   * @returns {Promise<void>} A promise indicating the completion of the upsert operation.
   */
  async upsert<T extends RecordMetadata = RecordMetadata>(
    vectors: Vector<T>[],
  ): Promise<void> {
    try {
      await this.getIndexWithNamespace().upsert(
        this.addCuidToVectors<T>(vectors),
      );
    } catch (error) {
      console.error("Error during vector upsert: ", error);
      Sentry.captureException(error, {
        level: "error",
        extra: { vectors },
      });
      throw error;
    }
  }

  /**
   * Clears all vectors within the current namespace of the index.
   * This action cannot be undone and results in the loss of all vectors within the namespace.
   * @returns {Promise<void>} A promise that resolves when the namespace is successfully cleared.
   */
  async clearNamespace(): Promise<void> {
    try {
      await this.getIndexWithNamespace().deleteAll();
    } catch (error) {
      console.error("Error during namespace clearing: ", error);
      Sentry.captureException(error, {
        level: "error",
      });
      throw error;
    }
  }

  /**
   * Clears the entire index in the Vectordatabase.
   * This action is irreversible and removes all vectors and associated data.
   * @returns {Promise<void>} A promise that resolves when the index is successfully cleared.
   */
  async clearIndex(): Promise<void> {
    try {
      await this._pinecone.deleteIndex(this._indexName);
      await this._pinecone.createIndex({
        name: this._indexName,
        dimension: STANDARD_DIMENSIONS,
        metric: STANDARD_METRIC,
        waitUntilReady: true,
        spec: {
          serverless: {
            cloud: "aws",
            region: "us-west-2",
          },
        },
      });
    } catch (error) {
      console.error("Error during index clearing: ", error);
      Sentry.captureException(error, {
        level: "error",
      });
      throw error;
    }
  }

  /**
   * Deletes vectors from the Vectordatabase index by their IDs.
   * @param {string[]} ids - An array of vector IDs to delete.
   * @returns {Promise<void>} A promise indicating the completion of the delete operation.
   */
  async delete(ids: string[]): Promise<void> {
    try {
      await this.getIndexWithNamespace().deleteMany(ids);
    } catch (error) {
      console.error("Error during vectors deletion: ", error);
      Sentry.captureException(error, {
        level: "error",
        extra: { ids },
      });
      throw error; // Re-throw the error for further handling if needed.
    }
  }

  /**
   * Deletes the entire index from the Vectordatabase.
   * This action is irreversible and removes all vectors and associated data.
   * @returns {Promise<void>} A promise that resolves when the index is successfully deleted.
   */
  async deleteIndex(): Promise<void> {
    try {
      await this._pinecone.deleteIndex(this._indexName);
    } catch (error) {
      console.error("Error during index deletion: ", error);
      Sentry.captureException(error, {
        level: "error",
      });
      throw error;
    }
  }
}

const vectorStorage = new VectorStorageHandler();
export default vectorStorage;
