import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: "org-3JtdYfoxsj3LBRDcmYbTF61R",
});
