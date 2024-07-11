export const StreamChat = jest.fn().mockImplementation(() => ({
  channel: jest.fn().mockImplementation(() => ({
    create: jest.fn(),
    update: jest.fn(),
    addModerators: jest.fn().mockResolvedValue({ channel: {} }),
    removeMembers: jest.fn(),
  })),
  createToken: jest.fn().mockReturnValue("1"),
  queryChannels: jest.fn().mockResolvedValue([]),
}));
