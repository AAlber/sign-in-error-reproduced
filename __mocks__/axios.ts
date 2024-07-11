const axios = {
  create: jest.fn().mockReturnValue({
    post: jest.fn().mockResolvedValue({
      data: {},
      status: 200,
    }),
  }),
  post: jest.fn().mockResolvedValue({
    data: {},
    status: 200,
  }),
};

export default axios;
