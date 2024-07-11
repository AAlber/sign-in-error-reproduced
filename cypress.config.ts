import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "j1vep7",
  screenshotOnRunFailure: !process.env.CYPRESS_BASE_URL, // do not take screenShots when running on github
  e2e: {
    viewportWidth: 1920,
    viewportHeight: 1080,
    retries: 1,
    requestTimeout: 30000,
    defaultCommandTimeout: 30000,
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:3000",
    //testIsolation: false,
  },
  env: {
    test_email: "ebert@fuxam.de",
    test_password: "CedricEbert",
    includeShadowDom: false,
  },
});
