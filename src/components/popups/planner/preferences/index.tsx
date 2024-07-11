import { useChat } from "ai/react";
import cuid from "cuid";
import { AIChat, AISymbol, Message } from "fuxam-ui";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { CarouselItem } from "@/src/components/reusable/shadcn-ui/carousel";
import { Textarea } from "@/src/components/reusable/shadcn-ui/text-area";
import useSchedule from "@/src/components/schedule/zustand";
import type { ScheduleAppointment } from "@/src/types/appointment.types";
import useUser from "@/src/zustand/user";
import usePlanner from "../zustand";
import EmptyState from "./empty";

const Preferences = () => {
  const { user } = useUser();
  const { t } = useTranslation("page");
  const {
    course,
    carouselAPI,
    messages: zustandMessages,
    draftAppointments,
    organizers,
    rooms,
    waitingForFirstResponse,
    setWaitingForFirstResponse,
    setDraftAppointments,
    setMessages: setZustandMessages,
  } = usePlanner();

  const { refreshAppointments } = useSchedule();

  const {
    data,
    messages,
    isLoading,
    input,
    append,
    handleInputChange,
    handleSubmit,
    setMessages,
  } = useChat({
    api: "/api/ai-planner/answer",
    initialMessages: zustandMessages,
    body: {
      data: {
        layerId: course?.layer_id || "",
        organizerIds: organizers.map((organizer) => organizer.id),
        roomIds: rooms.map((room) => room.id),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    } satisfies { data: any },
    onResponse: () => setWaitingForFirstResponse(false),
  });

  useEffect(() => {
    if (!course) setMessages([]);
  }, [course]);

  useEffect(() => {
    setZustandMessages(messages);
  }, [messages]);

  useEffect(() => {
    if (!data) return;
    if (data.length === 0) return;
    console.log("ADDING DRAFT!");
    try {
      console.log("Parsing!");
      console.log("data", data);
      const parsedData: any = JSON.parse(
        (data[data.length - 1] as any).plannerData,
      );

      if (parsedData.status === "idle") {
        setMessages(
          messages.map((m) => {
            if (m.content.includes("Status:")) {
              return {
                ...m,
                content: t("ai-planner.status.gnerating-preview"),
              };
            } else {
              return m;
            }
          }),
        );
        return;
      }

      if (parsedData.status === "generating-preview") {
        console.log("Generating preview!");
        return;
      }
      if (parsedData.status === "preview-ready") {
        const updatedAppointments = (
          parsedData.draftAppointments as ScheduleAppointment[]
        ).map((appointment) => {
          return {
            ...appointment,
            id: cuid(),
            dateTime: new Date(appointment.dateTime),
          };
        });

        const lastMessage = messages.slice(-1)[0];
        if (
          lastMessage &&
          lastMessage.role === "assistant" &&
          lastMessage.content.includes("Status:")
        ) {
          carouselAPI?.scrollNext();
        }

        setDraftAppointments(updatedAppointments);
        refreshAppointments();
      }
    } catch (e) {
      console.log("Failed to parse!");
      console.error(e);
    }
  }, [data]);

  useEffect(() => {
    const chatMessageList = document.getElementById("chat-message-list");
    if (chatMessageList) {
      chatMessageList.scrollTop = chatMessageList.scrollHeight;
    }
  }, [messages]);

  return (
    <CarouselItem className="flex h-[600px] flex-col">
      <div className="flex-1 overflow-y-scroll py-2" id="chat-message-list">
        {messages.length === 0 ? (
          <EmptyState
            append={append}
            onSelectTemplate={() => setWaitingForFirstResponse(true)}
          />
        ) : (
          <AIChat>
            {messages.map((message, i) => (
              <Message key={i}>
                {message.role === "assistant" ? (
                  <AISymbol state={isLoading ? "spinning" : "idle"} />
                ) : (
                  <Message.Picture imageUrl={user.image || ""} />
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
                    text={t("general.loading")}
                    className="text-muted"
                  />
                </Message.Content>
              </Message>
            )}
          </AIChat>
        )}
      </div>
      <div
        className="flex items-center gap-2 border-t border-border p-3"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            setWaitingForFirstResponse(true);
            handleSubmit(e as any);
          }
        }}
      >
        <Textarea
          disabled={isLoading}
          placeholder={t("concierge.placeholer")}
          value={input}
          onChange={handleInputChange}
        />
      </div>
      <div
        className="flex items-center gap-2 border-t border-border p-3"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            setWaitingForFirstResponse(true);
            handleSubmit(e as any);
          }
        }}
      >
        <Button className="w-full" onClick={() => carouselAPI?.scrollPrev()}>
          <ChevronLeft className="mr-1 h-4 w-4" />
          {t("planner_selection")}
        </Button>
        <Button
          disabled={draftAppointments.length === 0}
          className="w-full"
          onClick={() => carouselAPI?.scrollNext()}
        >
          {t("planner_summary")}
          <ChevronRight className="ml-1h-4 w-4" />
        </Button>
      </div>
    </CarouselItem>
  );
};

export default Preferences;
