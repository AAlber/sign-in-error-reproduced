export const Resend = jest.fn().mockImplementation(() => ({
  emails: {
    send: jest.fn().mockResolvedValue({ data: {}, error: null }),
  },
}));
