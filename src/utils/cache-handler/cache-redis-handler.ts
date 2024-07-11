import * as Sentry from "@sentry/nextjs";
import { kv } from "@vercel/kv";
import type { CacheKeyTypeMapping } from "./cache-key-types";

/**
 * Class responsible for handling cache operations. This class provides an abstraction
 * over a key-value store, offering methods to set, get, and invalidate cache entries.
 * It uses a type-safe approach, ensuring that the values set and retrieved are
 * consistent with the expected types defined in CacheKeyTypeMapping.
 */
class CacheHandler {
  /**
   * Sets a value in the cache with an optional TTL (Time To Live).
   * This method ensures type safety by enforcing the value type to match
   * the expected type for the given cache key.
   * @param {keyof CacheKeyTypeMapping} prefix - The prefix for the cache key.
   * @param {string} key - The specific key for the cache entry.
   * @param {CacheKeyTypeMapping[TCacheKey]} value - The value to store in the cache.
   * @param {number} [ttl] - Optional TTL in seconds. Defaults to 7 days, maximum 31 days.
   * @throws Will throw an error if the TTL is greater than 31 days.
   */
  async set<TCacheKey extends keyof CacheKeyTypeMapping>(
    prefix: TCacheKey,
    key: string,
    value: CacheKeyTypeMapping[TCacheKey],
    ttl?: number,
  ) {
    console.log("Setting cache key:", prefix, key);
    const cacheKey = `${prefix}:${key}`;
    try {
      Sentry.addBreadcrumb({
        message: "Attempting to set cache key: " + cacheKey,
        level: "info",
      });

      if (ttl && ttl > 60 * 60 * 24 * 31)
        throw new Error("TTL cannot be greater than 31 days");

      const action = ttl
        ? await kv.setex(cacheKey, ttl, value)
        : await kv.set(cacheKey, value);

      Sentry.addBreadcrumb({
        message: "Cache key set successfully: " + cacheKey,
        level: "info",
      });

      return action;
    } catch (error) {
      Sentry.captureException(error, {
        extra: { key: cacheKey, operation: "set", value, ttl },
      });
    }
  }

  /**
   * Retrieves a value from the cache.
   * Ensures that the returned value matches the expected type for the given cache key.
   * @param {keyof CacheKeyTypeMapping} prefix - The prefix for the cache key.
   * @param {string} key - The specific key for the cache entry.
   * @returns {Promise<CacheKeyTypeMapping[TCacheKey]>} The value from the cache or null if not found.
   * @throws Will throw an error if there is an issue retrieving the value.
   */
  async get<TCacheKey extends keyof CacheKeyTypeMapping>(
    prefix: TCacheKey,
    key: string,
  ): Promise<CacheKeyTypeMapping[TCacheKey]> {
    const cacheKey = `${prefix}:${key}`;
    console.log("Getting cache key:", cacheKey);
    try {
      Sentry.addBreadcrumb({
        message: "Attempting to retrieve cache key: " + cacheKey,
      });

      const time = Date.now();
      const data = (await kv.get(cacheKey)) as CacheKeyTypeMapping[TCacheKey];

      Sentry.addBreadcrumb({
        message:
          "Cache key retrieved successfully: " +
          cacheKey +
          " in " +
          (Date.now() - time) +
          "ms",
      });

      return data;
    } catch (error) {
      Sentry.captureException(error, {
        extra: { key: cacheKey, operation: "get" },
      });
      throw error;
    }
  }

  /**
   * Object containing methods for invalidating cache entries.
   */
  invalidate = {
    /**
     * Invalidates a single cache entry.
     * @param {keyof CacheKeyTypeMapping} prefix - The prefix for the cache key.
     * @param {string} key - The specific key to be invalidated.
     */
    single: async (prefix: keyof CacheKeyTypeMapping, key: string) => {
      console.log("Invalidating single cache key:", prefix, key);
      const cacheKey = `${prefix}:${key}`;
      try {
        Sentry.addBreadcrumb({
          message: "Attempting to invalidate single cache key: " + cacheKey,
        });

        await kv.del(cacheKey);

        Sentry.addBreadcrumb({
          message: "Cache key invalidated successfully: " + cacheKey,
        });
      } catch (error) {
        Sentry.captureException(error, {
          extra: { key: cacheKey, operation: "invalidate single" },
        });
      }
    },

    /**
     * Invalidates multiple cache entries.
     * This method allows for the invalidation of a batch of cache entries based on
     * their keys. It utilizes a pipeline for efficient bulk deletion.
     * @param {keyof CacheKeyTypeMapping} prefix - The prefix for the cache keys. It is used to construct
     *        the full cache keys in combination with the provided keys array.
     * @param {string[]} keys - An array of keys to be invalidated. These keys will be appended to the prefix
     *        to form the full cache keys.
     * @throws Will throw an error if there is an issue with the bulk invalidation process.
     */
    many: async (prefix: keyof CacheKeyTypeMapping, keys: string[]) => {
      console.log("Invalidating many cache keys:", prefix, keys);
      try {
        Sentry.addBreadcrumb({
          message:
            "Attempting to invalidate multiple cache keys: " + keys.join(", "),
        });

        if (keys.length === 0) return;

        const pipeline = kv.pipeline();
        keys.forEach((key) => pipeline.del(`${prefix}:${key}`));
        await pipeline.exec();

        Sentry.addBreadcrumb({
          message: "Multiple cache keys invalidated successfully",
        });
      } catch (error) {
        Sentry.captureException(error, {
          extra: {
            keys: keys.map((key) => `${prefix}:${key}`),
            operation: "invalidate many",
          },
        });
      }
    },

    /**
     * Custom invalidate method that deletes cache entries where the key matches the prefix
     * and the value contains the specified search parameter.
     * This method scans through the cache keys that match a given prefix, retrieves their values,
     * and invalidates those where the value contains the specified search parameter.
     * @param {keyof CacheKeyTypeMapping} prefix - The prefix for the cache key. This is used to narrow down
     *        the keys to be scanned and potentially deleted.
     * @param {string} searchParam - The search parameter to match in the value of each cache entry.
     *        Only entries that include this parameter in their value will be invalidated.
     * @param {string} type - The type of cache invalidation. This can be "single" or "many".
     * @param {string} origin - The origin of the cache invalidation. This is used for tracking and debugging.
     * @throws Will throw an error if there is an issue with the scanning or deletion process.
     */
    custom: async (
      data:
        | {
            prefix: keyof CacheKeyTypeMapping;
            type: "single";
            searchParam: string;
            origin: string;
          }
        | {
            prefix: keyof CacheKeyTypeMapping;
            type: "many";
            searchParam: string[];
            origin: string;
          },
    ) => {
      const { prefix, type, searchParam } = data;

      Sentry.setContext("cache-invalidation", data);
      Sentry.addBreadcrumb({ message: "Custom cache invalidation...", data });

      if (type === "single" && searchParam.trim() === "")
        return Sentry.captureMessage(
          "No searchParam provided for custom cache invalidation",
          { level: "debug" },
        );
      if (type === "many" && searchParam.length === 0)
        return Sentry.captureMessage(
          "No searchParam array provided for custom cache invalidation",
          { level: "debug" },
        );

      try {
        Sentry.addBreadcrumb({
          message:
            "Attempting custom cache invalidation with searchParam: " +
            searchParam,
        });

        let cursor = 0;
        let scanAgain = false;
        do {
          // Scan for keys with the given prefix
          const [newCursor, keys] = await kv.scan(cursor, {
            match: `${prefix}:*`,
            count: 100,
          });

          cursor = newCursor;
          scanAgain = cursor !== 0;

          if (keys.length === 0) return;

          // Retrieve values for keys and filter based on searchParam
          const values = await Promise.all(keys.map((key) => kv.get(key)));

          const keysToDelete: string[] = [];

          // Filter keys based on searchParam
          for (let i = 0; i < keys.length; i++) {
            const value = JSON.stringify(values[i]);
            let matchFound = false;

            if (type === "single") {
              // If the type is "single", check if the value contains the searchParam string
              if (value && value.includes(searchParam)) {
                matchFound = true;
              }
            } else if (type === "many") {
              // If the type is "many", check if the value contains any of the strings in searchParam array
              for (const param of searchParam) {
                if (value && value.includes(param)) {
                  matchFound = true;
                  break; // Break early if any parameter matches
                }
              }
            }

            // If a match is found, add the key to keysToDelete array
            if (matchFound) {
              if (keys[i]) keysToDelete.push(keys[i]!);
            }
          }

          console.log("Keys to delete based on searchParam:", keysToDelete);

          Sentry.addBreadcrumb({
            message: "Keys to delete based on searchParam:",
            data: { keysToDelete },
          });

          Sentry.addBreadcrumb({
            message: "Deleting " + keysToDelete.length + " keys...",
          });

          if (keysToDelete.length > 0) {
            const pipeline = kv.pipeline();
            keysToDelete.forEach((key) => {
              pipeline.del(key);
            });
            await pipeline.exec();
          }
        } while (scanAgain);

        Sentry.captureMessage("Custom cache invalidation completed", {
          level: "debug",
        });
      } catch (error) {
        Sentry.captureException(error, {
          extra: {
            operation: "invalidate custom",
            prefix,
            searchParam,
          },
        });
      }
    },
  };
}

const cacheHandler = new CacheHandler();
export default cacheHandler;
