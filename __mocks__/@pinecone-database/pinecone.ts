export const Pinecone = jest.fn().mockImplementation(() => ({
  createIndex: jest.fn(),
  deleteIndex: jest.fn(),
  Index: jest.fn().mockReturnValue({
    namespace: jest.fn(),
    query: jest.fn().mockResolvedValue({
      matches: [{ metadata: { path: "" } }],
    }),
  }),
}));
