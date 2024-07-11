//img and font src might need "data:", this approach is unsafe though
// https://i.ytimg.com is apparently needed for adding an AI task
// blob: on worker src might be okay since clerk is the only thing doing that https://security.stackexchange.com/questions/190331/is-allowing-blob-in-content-security-policy-a-risk


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
