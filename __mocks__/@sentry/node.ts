export const addBreadcrumb = jest.fn();
export const captureException = jest.fn((e) => {
  const err = e as Error;
  console.log("Sentry error: ", err);
});

export const withSentryConfig = jest.fn();
export const setUser = jest.fn();
export const setContext = jest.fn();
