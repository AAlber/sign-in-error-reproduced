import { useChat } from "ai/react";
import { AIChat, AISymbol, Message } from "fuxam-ui";
import { ChevronLeft, CornerDownLeft, Microscope } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import classNames from "@/src/client-functions/client-utils";
import { useRotatingText } from "@/src/client-functions/client-utils/hooks";
import { Badge } from "@/src/components/reusable/shadcn-ui/badge";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/reusable/shadcn-ui/card";
import { CommandSeparator } from "@/src/components/reusable/shadcn-ui/command";
import { Input } from "@/src/components/reusable/shadcn-ui/input";
import type { ConciergeContext } from "@/src/pages/api/concierge/functions";
import useUser from "@/src/zustand/user";
import useFinder from "../zustand";
import ConciergeNoMessages from "./no-messages";

export default function ConciergeChat() {
  const { setMode } = useFinder();
  const { t } = useTranslation("page");
  const { user } = useUser();
  const [waitingForFirstResponse, setWaitingForFirstResponse] = useState(false);
  const {
    messages,
    isLoading,
    input,
    append,
    handleInputChange,
    handleSubmit,
  } = useChat({
    api: "/api/concierge/answer",
    body: {
      context: {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      } satisfies ConciergeContext,
    },
    onResponse: () => setWaitingForFirstResponse(false),
  });

  const { rotatingWord } = useRotatingText(
    new Array(10).fill(0).map((_, idx) => `concierge.loading${idx + 1}`),
  );

  useEffect(() => {
    const chatMessageList = document.getElementById("chat-message-list");
    if (chatMessageList) {
      chatMessageList.scrollTop = chatMessageList.scrollHeight;
    }
  }, [messages]);

  return (
    <Card className="border-0">
      <CardHeader className="p-3">
        <CardTitle className="flex items-center gap-2 font-normal text-contrast">
          <Button
            size={"iconSm"}
            variant={"ghost"}
            onClick={() => setMode("search")}
          >
            <ChevronLeft className="size-5" />
          </Button>
          {t("ai.concierge")}{" "}
          <Badge
            variant={"outline"}
            className="rounded-full font-normal text-contrast/80"
          >
            <Microscope className="mr-1.5 size-3" />
            {t("experiment")}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CommandSeparator />
      <CardContent
        id="chat-message-list"
        className="h-[500px] overflow-y-scroll p-0"
      >
        {messages.length === 0 ? (
          <ConciergeNoMessages
            append={append}
            onSelectTemplate={() => setWaitingForFirstResponse(true)}
          />
        ) : (
          <AIChat className="py-2">
            {messages.map((message, i) => (
              <Message key={i}>
                {message.role === "assistant" ? (
                  <AISymbol state={isLoading ? "spinning" : "idle"} />
                ) : (
                  <Message.Picture
                    className="object-cover"
                    imageUrl={user.image || ""}
                  />
                )}
                <Message.Content>
                  <Message.Title
                    name={
                      message.role === "assistant"
                        ? t("artificial-intelligence")
                        : user.name
                    }
                  />
                  <Message.Text
                    text={message.content}
                    format={message.role === "assistant" ? "markdown" : "text"}
                  />
                </Message.Content>
              </Message>
            ))}
            {waitingForFirstResponse && (
              <Message>
                <AISymbol state="thinking" />
                <Message.Content>
                  <Message.Title name={t("artificial-intelligence")} />
                  <Message.Text
                    format="text"
                    text={t(rotatingWord ?? "concierge.loading1")}
                    className="text-muted"
                  />
                </Message.Content>
              </Message>
            )}
          </AIChat>
        )}
      </CardContent>
      <CommandSeparator />
      <div
        className="bg-background p-3"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            setWaitingForFirstResponse(true);
            handleSubmit(e as any);
          }
        }}
      >
        <div className="relative">
          <Input
            placeholder={t("concierge.placeholer")}
            value={input}
            onChange={handleInputChange}
          />
          <div
            className={classNames(
              "absolute -top-0.5 bottom-0 right-2 flex items-center gap-1.5 text-sm text-muted-contrast/60 transition-all duration-500 ease-in-out",
              input.length > 0 ? "opacity-100" : "opacity-0",
            )}
          >
            {t("submit-message")}
            <kbd className="kbd mt-0.5 rounded-md border border-border bg-foreground p-0.5">
              <CornerDownLeft size={12} />
            </kbd>
          </div>
        </div>
      </div>
    </Card>
  );
}
