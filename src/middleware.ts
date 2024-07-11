import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";
// import { cachedRoutes } from "./utils/cache-handler/cache-key-types";
// import { handleCachedRoute } from "./utils/cache-handler/cache-middleware";

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

const isPublicRoute = createRouteMatcher([
  "/api/ai/budget/get-budget-status",
  "/api/ai/budget/update-budget-status",
  "/api/users/update-user-clerk",
  "/invitation(.*)",
  "/api/invite(.*)",
  "/api/stripe/webhook",
  "/api/stripe/webhook-connect-accounts",
  "/api/role/has-roles-with-access/:anything*",
  "/api/functions",
  "/api/cloudflare/auth",
  "/maintenance",
  "/api/notifications/link-user-to-push-token",
  "/api/email(.*)",
  "/api/schedule(.*)",
  // cached routes are public, since the middleware handles auth via the FUXAM_SECRET
  "/api/kv-cached(.*)",
  "/api/concierge/answer",
  "/api/institution-user-data-field/get-user-id-field-data",
  "/api/institution-user-data-field/get-user-id-field-value",
  "/sign-in(.*)",
  "/sign-up(.*)",
  // "/monitoring(.*)",
]);

const isIgnoredRoute = createRouteMatcher([
  "/api/edge-config",
  "/api/custom-integrations(.*)",
  "/api/concierge/data-retrieval",
  "/api/ai-planner/get-schedule-data-for-planning",
  "/api/ai/budget/update-budget-status",
  "/api/ai/budget/get-budget-status",
  "/api/notifications/send",
]);

export default clerkMiddleware(async (auth, request) => {
  if (
    request.nextUrl.pathname.includes("/process-invitation/") &&
    !auth().userId &&
    !isPublicRoute(request)
  ) {
    return NextResponse.redirect(
      `${
        process.env.NEXT_PUBLIC_SERVER_URL
      }sign-up?redirect_url=${encodeURIComponent(request.url)}`,
    );
  } else if (!auth().userId && !isPublicRoute(request)) {
    return auth().redirectToSignIn({ returnBackUrl: request.url });
  }
  // const isCachedRoute = cachedRoutes.some((route) =>
  //   request.nextUrl.pathname.includes(route.path),
  // );
  if (!isPublicRoute(request) && !isIgnoredRoute(request)) {
    auth().protect();
  }
  if (true) return NextResponse.next();
  else
    try {
      // return handleCachedRoute(auth, request);
    } catch (error) {
      Sentry.captureException(error);
      return new Response("Internal Server Error", { status: 500 });
    }
});
