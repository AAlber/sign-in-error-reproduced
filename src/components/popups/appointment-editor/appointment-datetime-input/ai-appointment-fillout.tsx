import ai from "@/src/client-functions/client-ai/client-ai-handler";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/reusable/shadcn-ui/popover";
import { Textarea } from "@/src/components/reusable/shadcn-ui/text-area";
import { toast } from "@/src/components/reusable/toaster/toast";
import api from "@/src/pages/api/api";
import { GenerateAppointmentData } from "@/src/types/ai/ai-request-response.types";
import { log } from "@/src/utils/logger/logger";
import { Wand2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { rrulestr } from "rrule";
import usePersistAppointmentEditor from "../persist-appointment-editor-zustand";
import useAppointmentEditor from "../zustand";

export default function AIAppointmentFillout() {
  const [text, setText] = useState("");
  const { setRecurrence, setDuration, setDateTime } = useAppointmentEditor();
  const { setDateTime: setPersistedDateTime } =
  usePersistAppointmentEditor.getState();
  const { t } = useTranslation("page");

  const handleAIFillOut = async () => {
    try {
      log.info("Filling out with AI...");
      const res = await fetch(api.getAIAppointmentFillout, {
        method: "POST",
        body: JSON.stringify({ text }),
      });

      const data = await ai.handle.response<GenerateAppointmentData>(res);
      if (!data) return;

      setDateTime(new Date(data.dateTime));
      setPersistedDateTime(new Date(data.dateTime));
      setDuration(String(data.duration));
      setRecurrence(data.rrule ? rrulestr(data.rrule) : null);

    } catch (e) {
      log.error(e).cli()
      toast.error("Failed to fill out with AI. Please try again.", {});
    }
  };

  return (
    <div className="w-full">
      <Popover>
        <PopoverTrigger className="cursor-pointer text-end text-sm text-primary hover:underline">
          <Button variant={"ghost"} size={"iconSm"}>
            <Wand2 className="size-4 text-muted-contrast" />
          </Button>
        </PopoverTrigger>
        <PopoverContent side="left">
          <Textarea placeholder="Enter your appointment time details here..."
           value={text} onChange={(e) => setText(e.target.value)} />
          <Button
            disabled={text.trim().length === 0}
            onClick={handleAIFillOut}
            className="mt-2 w-full"
            variant={"cta"}
          >
            {false ? t("general.loading") : <>{t("planner_ai_fill_out")}</>}
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
