export const kv = {
  set: jest.fn().mockResolvedValue("OK"),
  setEx: jest.fn().mockResolvedValue("OK"),
  get: jest.fn().mockResolvedValue(""),
  del: jest.fn().mockResolvedValue("OK"),
  pipeline: jest.fn().mockReturnValue({ del: jest.fn() }),
  scan: jest.fn().mockResolvedValue([undefined, []]),
};
