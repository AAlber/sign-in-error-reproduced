import type { Channel, StreamChat } from "stream-chat";
import type { StreamMessage } from "stream-chat-react";
import { z } from "zod";
import type { StreamChatGenerics } from "@/src/components/reusable/page-layout/navigator/chat/types";

export const pollSchema = z.object({
  question: z.string().min(1),
  options: z.object({ text: z.string().min(1) }).array(),
  allowMultiple: z.boolean().default(false),
});

export type PollReducerActions =
  | { type: "addVote"; optionId: string }
  | { type: "removeVote"; optionId: string }
  | { type: "replaceVote"; removeOptionId: string; addOptionId: string }
  | { type: "initVotes"; value: Poll };

export type PollSchemaType = z.infer<typeof pollSchema>;
export type PollReducerOperation = PollReducerActions["type"];
export type Poll = StreamMessage<StreamChatGenerics>["poll"];

export type SubmitPollArgs = {
  value: PollSchemaType;
  onSubmit: () => void;
  getstreamClient: StreamChat;
  currentChannel: Channel<StreamChatGenerics>;
};
