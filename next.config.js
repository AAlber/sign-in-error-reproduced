//img and font src might need "data:", this approach is unsafe though
// https://i.ytimg.com is apparently needed for adding an AI task
// blob: on worker src might be okay since clerk is the only thing doing that https://security.stackexchange.com/questions/190331/is-allowing-blob-in-content-security-policy-a-risk
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com https://fcm.googleapis.com/v1/projects/fuxam-app-capacitor-test/messages:send https://www.googleapis.com/auth/firebase.messaging https://www.youtube.com/s/player/ https://www.youtube.com/s/player/dee96cfa/www-widgetapi.vflset/www-widgetapi.js https://www.youtube.com/iframe_api https://player.vimeo.com/api/player.js https://vercel.live https://js.intercomcdn.com https://vercel.live/_next-live/feedback/feed https://widget.intercom.io https://storage.googleapis.com/fuxam-web-7e071.appspot.com https://js.stripe.com https://www.loom.com https://sdk.birdeatsbug.com https://vimeo.com https://apis.google.com https://unpkg.com https://emerging-sheepdog-40.clerk.accounts.dev https://clerk.fuxam.app https://clerk.fuxam.app/:path* https://emerging-sheepdog-40.clerk.accounts.dev/:path* https://faye-us-east.stream-io-api.com https://faye-us-east.stream-io-api.com/:path* https://api.stream-io-api.com https://api.stream-io-api.com/:path* https://accounts.google.com https://accounts.google.com/:path* https://www.googleapis.com https://www.googleapis.com/:path* wss://faye-us-east.stream-io-api.com wss://faye-us-east.stream-io-api.com/:path* wss://chat.stream-io-api.com wss://chat.stream-io-api.com/:path* https://chat.stream-io-api.com https://maps.googleapis.com https://browser.sentry-cdn.com;
  child-src ${process.env.SERVER_URL};
  frame-src https://vercel.live http://localhost:3000 https://intercom-sheets.com http://www.loom.com https://www.loom.com https://www.loom.com/ https://js.stripe.com https://www.youtube.com https://player.vimeo.com https://player.vimeo.com/api/player.js https://vimeo.com https://www.youtube-nocookie.com https://fuxam-web-7e071.firebaseapp.com;
  style-src 'self' 'unsafe-inline' https://sdk.birdeatsbug.com https://fonts.googleapis.com ;
  object-src 'self' data:; 
  img-src * data: blob:;
  media-src 'self' https://js.intercomcdn.com blob:;
  connect-src 'self' https://mobile.fuxam.app https://unsplash.com https://images.unsplash.com ${process.env.NEXT_PUBLIC_R2_BUCKET_URL} ${process.env.NEXT_PUBLIC_WORKER_URL} wss://ws-us3.pusher.com https://sockjs-us3.pusher.com https://api.tiptap.dev/ https://api.tiptap.dev/v https://vercel.live https://js.stripe.com https://www.loom.com wss://nexus-websocket-a.intercom.io https://api-iam.intercom.io https://4xe535du.api.sanity.io https://api-free.deepl.com https://storage.googleapis.com/fuxam-web-7e071.appspot.com https://sdk.birdeatsbug.com https://unpkg.com https://api.birdeatsbug.com https://vimeo.com https://dublin.stream-io-cdn.com https://securetoken.googleapis.com https://identitytoolkit.googleapis.com https://clerk.fuxam.app https://clerk.fuxam.app/:path* https://edge-config.vercel.com https://vitals.vercel-insights.com https://api.openai.com https://api.unsplash.com https://firebasestorage.googleapis.com https://faye-us-east.stream-io-api.com https://faye-us-east.stream-io-api.com/:path* https://emerging-sheepdog-40.clerk.accounts.dev https://emerging-sheepdog-40.clerk.accounts.dev/:path* https://api.stream-io-api.com https://api.stream-io-api.com/:path* https://accounts.google.com https://www.googleapis.com https://accounts.google.com/:path* https://www.googleapis.com/:path* wss://faye-us-east.stream-io-api.com wss://faye-us-east.stream-io-api.com/:path* wss://chat.stream-io-api.com wss://chat.stream-io-api.com/:path* https://chat.stream-io-api.com https://maps.googleapis.com https://api.giphy.com https://pingback.giphy.com https://media3.giphy.com *.amazonaws.com *.ingest.sentry.io https://fcm.googleapis.com/v1/projects/fuxam-app-capacitor-test/messages:send;
  font-src 'self' https://fonts.intercomcdn.com https://unpkg.com https://fonts.googleapis.com https://fonts.gstatic.com;  
  worker-src 'self' blob:;
`;

const turboPackEnabled =
  typeof process.env.NEXT_TURBOPACK_TRACING !== "undefined"; // set from package.json

const securityHeaders = [
  {
    /** Detects reflected XSS attacks and prevents them **/
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    /** Disables site from being displayed in iframe, prevents clickjacking **/
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    /** Disables Google's FLoC to protect user's privacy from Google **/
    key: "Permissions-Policy",
    value: "interest-cohort=()",
  },
  {
    /** Retains much of the referrer's usefulness, while mitigating the risk of leaking data cross-origins. **/
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
  },
];

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: false,
  experimental: {
    instrumentationHook: true,
    ...(process.env.NODE_ENV === "development"
      ? {
          turbotrace: {}, // enable with default options, see other options here: https://nextjs.org/docs/pages/api-reference/next-config-js/output#experimental-turbotrace
        }
      : {}),
    optimizePackageImports: [
      "@radix-ui",
      "@radix-ui/react-icons",
      "@uiw/react-codemirror",
      "@dnd-kit/core",
      "@tiptap",
      "@tiptap/core",
      "@tiptap/react",
      "@emoji-mart/data",
      "@emoji-mart/react",
    ],
  },
  transpilePackages: ["mime"],
  images: {
    //TODO: ADD back domains here "firebasestorage.googleapis.com"
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  async headers() {
    return [
      {
        // Applies security headers to all routes in the application.
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
          },
        ],
      },
    ];
  },
  ...(!turboPackEnabled
    ? {
        webpack: (config, { dev }) => {
          config.experiments = { ...config.experiments, topLevelAwait: true };
          config.resolve.fallback = { fs: false, path: false };
          if (config.cache && !dev) {
            config.cache = Object.freeze({
              type: "memory",
            });
            config.cache.maxMemoryGenerations = 0;
          }
          // Important: return the modified config
          return config;
        },
      }
    : {}),
};

// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(config, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  // Suppresses source map uploading logs during build
  silent: true,

  org: "fuxam",
  project: "fuxam-web",
  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Transpiles SDK to be compatible with IE11 (increases bundle size)
  transpileClientSDK: true,

  // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
  tunnelRoute: "/monitoring",

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,
  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});
