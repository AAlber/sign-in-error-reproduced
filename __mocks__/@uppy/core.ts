export const Uppy = jest.fn().mockImplementation(() => ({
  use: jest.fn().mockReturnValue({
    on: jest.fn(),
    getFiles: jest.fn().mockReturnValue([]),
  }),
}));
