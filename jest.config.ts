import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  testPathIgnorePatterns: [
    "<rootDir>/__tests__/helpers",
    "<rootDir>/__tests__/msw",
    "<rootDir>/__tests__/jest.setup.ts",
    "<rootDir>/__tests__/jest.global-teardown.ts",
  ],
  testEnvironment: "jest-environment-jsdom",
  reporters: ["default", "jest-junit"],
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/__tests__/tsconfig.json",
    },
  },
  moduleNameMapper: {
    "^.$": "./index.ts",
  },
  coverageReporters: ["json-summary", "text"],
  setupFilesAfterEnv: ["<rootDir>/__tests__/jest.setup.ts"],
  testTimeout: 60000,
  globalTeardown: "<rootDir>/__tests__/jest.global-teardown.ts",
};

export default createJestConfig(config);
