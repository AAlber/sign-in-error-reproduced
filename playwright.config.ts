    import { defineConfig, devices } from "@playwright/test";

    /**
     * Read environment variables from file.
     * https://github.com/motdotla/dotenv
     */

    /**
     * See https://playwright.dev/docs/test-configuration.
     */
    export default defineConfig({
      testDir: "./tests",
      /* Maximum time one test can run for. */
      timeout: 120 * 1000,
      globalSetup: require.resolve("./tests/global-setup"),
      expect: {
        /**
         * Maximum time expect() should wait for the condition to be met.
         * For example in `await expect(locator).toHaveText();`
         */
        timeout: 120 * 1000,
      },
      /* Run tests in files in parallel */
      fullyParallel: false,
      /* Fail the build on CI if you accidentally left test.only in the source code. */
      forbidOnly: !!process.env.CI,
      /* Retry on CI only */
      // retries: process.env.CI ? 2 : 0,
      retries: 0,
      
      /* Opt out of parallel tests on CI. */  
      // workers: process.env.CI ? 1 : undefined,
      workers: 1,
      /* Reporter to use. See https://playwright.dev/docs/test-reporters */
      reporter: "html",
      /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
      use: {
        /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
        actionTimeout: 0,
        video: 'retain-on-failure',
        headless: true,
        /* Base URL to use in actions like `await page.goto('/')`. */
        // baseURL: 'http://localhost:3000',

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: "on-first-retry",
        viewport: { width: 1440, height: 1130 },
      },
      /* Configure projects for major browsers */
      projects: [
        {
          name: "chromium",
          use: {
            ...devices["Desktop Chrome"],
            storageState: "playwright/.auth/user.json",
        },
        },
        // {
        //   name: "firefox",
        //   use: {
        //     ...devices["Desktop Firefox"],
        //     // storageState: "playwright/.auth/user.json",      
        //   },
        // },
        // {
        //   name: "webkit",
        //   use: {
        //     ...devices["Desktop Safari"],
        //     // storageState: "playwright/.auth/user.json",
        //  },
        // },

        /* Test against mobile viewports. */
        // {
        //   name: 'Mobile Chrome',
        //   use: { ...devices['Pixel 5'] },
        // },
        // {
        //   name: 'Mobile Safari',
        //   use: { ...devices['iPhone 12'] },
        // },

        /* Test against branded browsers. */
        // {
        //   name: 'Microsoft Edge',
        //   use: { channel: 'msedge' },
        // },
        // {
        //   name: 'Google Chrome',
        //   use: { channel: 'chrome' },
        // },
      ],

      /* Folder for test artifacts such as screenshots, videos, traces, etc. */
      // outputDir: 'test-results/',

      /* Run your local dev server before starting the tests */
      // webServer: {
      //   command: 'npm run start',
      //   port: 3000,
      // },
    });
