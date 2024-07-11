export const OpenAIApi = jest.fn().mockImplementation(() => ({
  chat: {
    completions: {
      create: jest
        .fn()
        .mockResolvedValue({ choices: [{ message: { content: "{}" } }] }),
    },
  },
  completions: {
    create: jest.fn().mockReturnValue({ choices: [{ text: "" }] }),
  },
  createCompletion: jest.fn().mockResolvedValue({
    data: {
      choices: [{ text: "mocked-icon" }],
    },
  }),
  embeddings: {
    create: jest.fn().mockResolvedValue({
      data: [{ embedding: [100] }],
      usage: { total_tokens: 100 },
    }),
  },
}));

export const Configuration = jest.fn().mockImplementation();
export default OpenAIApi;
