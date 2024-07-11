import "@testing-library/jest-dom";
import "isomorphic-fetch";
import "./styles/globals.css";
import { TextDecoder, TextEncoder } from "util";
import type * as serverStripeFn from "../src/server/functions/server-stripe";
import i18n from "../src/translations/i18n";
import { server } from "./msw/server";

/**
 * Fixes an open issue introduced to our app after installing and using @react-email dependency
 * https://github.com/jsdom/jsdom/issues/2524
 *
 * some related issues
 * https://github.com/inrupt/solid-client-authn-js/issues/1676#issuecomment-917016646
 * https://stackoverflow.com/questions/77358809/referenceerror-textencoder-is-not-defined-during-test-running-with-jest-and-msw
 */

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

jest.mock("../src/server/functions/server-role", () => ({
  __esModule: true,
  ...jest.requireActual("../src/server/functions/server-role"),
  isAdminModeratorOrEducator: jest.fn().mockResolvedValue(true),
}));

jest.mock("../src/server/functions/server-input", () => ({
  __esModule: true,
  ...jest.requireActual("../src/server/functions/server-input"),
  isValidUserId: jest.fn().mockReturnValue(true),
  isValidCuid: jest.fn().mockReturnValue(true),
}));

jest.mock("../src/server/functions/server-user", () => ({
  __esModule: true,
  ...jest.requireActual("../src/server/functions/server-user"),
}));

jest.mock<typeof serverStripeFn>(
  "../src/server/functions/server-stripe",
  () => ({
    __esModule: true,
    ...jest.requireActual<typeof serverStripeFn>(
      "../src/server/functions/server-stripe",
    ),
    /** need to mock stripe functions we dont need it in this test */
    checkSubscriptionHasSpaceFor1MoreUser: jest.fn().mockResolvedValue(true),
    getUserQuantityInformation: jest
      .fn()
      .mockResolvedValue({ willExceedMaxUsersIfOneMoreIsAdded: false }),
  }),
);

// Establish API mocking before all tests.
beforeAll(() => {
  i18n.init();
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  server.listen();
});

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(async () => {
  server.close();
});
