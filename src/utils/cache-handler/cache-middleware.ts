import type { ClerkMiddlewareAuth } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { env } from "@/src/env/server.mjs";
import edgeSql from "@/src/server/functions/edge-sql-handler/edge-sql-handler";
import cacheHandler from "@/src/utils/cache-handler/cache-redis-handler";
import { executeTransactionAndTrackTime } from "../utils";
import type { CachedRoute } from "./cache-key-types";
import { cachedRoutes } from "./cache-key-types";

/**
 * Handles the caching and retrieval of data for cached routes.
 *
 * @param {AuthObject} auth - An authentication object containing user information.
 * @param {NextRequest} request - The Next.js request object.
 * @returns {NextResponse} - A response object or a redirection based on authentication and cache status.
 */
export async function handleCachedRoute(
  auth: ClerkMiddlewareAuth,
  request: NextRequest,
): Promise<NextResponse | Response> {
  const userId = auth().userId;
  Sentry.setContext("middleware", { auth, request });
  const route = cachedRoutes.find((route) =>
    request.nextUrl.pathname.includes(route.path),
  );

  Sentry.addBreadcrumb({ message: "route", data: route });

  if (!route) throw new Error("No route found");

  if (userId && request.nextUrl.pathname.includes(route.path)) {
    // Uncomment the following line to disable caching for local development
    // Undo this before committing!
    const isCacheAllowed = process.env.SERVER_URL !== "http://localhost:3000";
    if (!isCacheAllowed) return fetchAndCacheData(route, userId, request);

    // Check user access for cached route
    const hasAccess = await checkUserAccess(route, userId, request);
    if (!hasAccess) return new Response("Unauthorized", { status: 401 });

    const cachedData = await fetchDataFromCacheIfAvailable(
      route,
      userId,
      request,
    );
    if (cachedData) {
      return new Response(
        typeof cachedData === "string"
          ? cachedData
          : JSON.stringify({ ...cachedData, cached: true }),
      );
    }

    // Fetch data from the original source and return
    return fetchAndCacheData(route, userId, request);
  }

  return NextResponse.next();
}

/**
 * Checks user access to a specific cached route.
 *
 * @param {CachedRoute} route - The cached route configuration.
 * @param {string} userId - The user's unique identifier.
 * @param {NextRequest} request - The Next.js request object.
 * @returns {boolean} - True if the user has access, false otherwise.
 */
async function checkUserAccess(
  route: CachedRoute,
  userId: string,
  request: NextRequest,
): Promise<boolean> {
  return executeTransactionAndTrackTime(
    async () => {
      Sentry.addBreadcrumb({
        message: "Checking user access for " + route.path,
        data: { userId, route },
      });
      // If the route is user centered, the user has automatically access, since the data is only for them
      // and the clerk auth middleware already makes sure the userId is belonging to the user.
      if (route.requiredKey === "userId") {
        Sentry.addBreadcrumb({ message: "User centered route" });
        return true;
      }

      // In case the route is not user centered, we need to check if the user has access to the
      // layerId with the according roles defined for this route. (LayerIds are the primary way of
      // protecting data in FUXAM)
      const layerId = request.nextUrl.searchParams.get("layerId");

      if (!layerId) throw new Error("No layerId found in search params");

      const hasAccess = await edgeSql.get.hasRolesWithAccess({
        userId,
        layerIds: [layerId],
        rolesWithAccess: route.accessRule(layerId)?.rolesWithAccess ?? [
          "admin",
          "moderator",
          "educator",
          "member",
        ],
      });

      if (!hasAccess) return false;

      return true;
    },
    {
      sentryMessage: "Checking user access for cached route",
      extraData: { userId, route },
    },
  );
}

/**
 * Fetches data from the cache for a specific cached route.
 *
 * @param {CachedRoute} route - The cached route configuration.
 * @param {string} userId - The user's unique identifier.
 * @param {NextRequest} request - The Next.js request object.
 */
async function fetchDataFromCacheIfAvailable(
  route: CachedRoute,
  userId: string,
  request: NextRequest,
): Promise<object | string | null> {
  return executeTransactionAndTrackTime(
    async () => {
      Sentry.addBreadcrumb({ message: "Fetching cached data..." });
      return cacheHandler.get(
        route.prefix,
        route.requiredKey === "userId"
          ? userId
          : request.nextUrl.searchParams.get(route.requiredKey) ?? "",
      );
    },
    {
      sentryMessage: "Fetching cached data...",
      extraData: { route, userId, request },
    },
  );
}

/**
 * Fetches data from the original source and caches it for a specific cached route.
 *
 * @param {CachedRoute} route - The cached route configuration.
 * @param {string} userId - The user's unique identifier.
 * @param {NextRequest} request - The Next.js request object.
 */
async function fetchAndCacheData(
  route: CachedRoute,
  userId: string,
  request: NextRequest,
): Promise<Response> {
  return executeTransactionAndTrackTime(
    async () => {
      Sentry.addBreadcrumb({
        message: "No cache. Fetching data from original source and caching...",
      });
      const url = `${env.SERVER_URL}${route.path}?${route.requiredKey}=${
        route.requiredKey === "userId"
          ? userId
          : request.nextUrl.searchParams.get(route.requiredKey)
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + env.FUXAM_SECRET,
        },
      });

      const data = await response.json();
      return new Response(JSON.stringify({ ...data, cached: false }));
    },
    {
      sentryMessage: "Fetching data from original source and caching...",
      extraData: { route, userId, request },
    },
  );
}
