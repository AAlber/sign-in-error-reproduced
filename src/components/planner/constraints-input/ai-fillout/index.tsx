import { useTranslation } from "react-i18next";
import { rrulestr } from "rrule";
import ai from "@/src/client-functions/client-ai/client-ai-handler";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/reusable/shadcn-ui/card";
import { Label } from "@/src/components/reusable/shadcn-ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/reusable/shadcn-ui/popover";
import { Textarea } from "@/src/components/reusable/shadcn-ui/text-area";
import { toast } from "@/src/components/reusable/toaster/toast";
import WithToolTip from "@/src/components/reusable/with-tooltip";
import api from "@/src/pages/api/api";
import { log } from "@/src/utils/logger/logger";
import usePlanner from "../../zustand";

export default function AIFillOutPopover() {
  const { aiLoading, setTab, setAiLoading, setConstraints, aiText, setAiText } =
    usePlanner();
  const { t } = useTranslation("page");

  const handleAIFillOut = async () => {
    try {
      log.info("Filling out with AI...");
      setAiLoading(true);
      setTab("manual");
      // call the AI service to fill out the text
      const res = await fetch(api.getAIFillout, {
        method: "POST",
        body: JSON.stringify({ text: aiText }),
      });

      setAiLoading(false);

      const data = await ai.handle.response<any>(res);
      if (!data) return;

      log.info("AI response: ", data);

      log.info("Parsing AI response...");
      const parsedData = data.constraints;

      log.info("Parsing RRule strings...");
      const updatedDataForRRule = {
        ...parsedData,
        availableTimeSlots: parsedData.availableTimeSlots.map((slot) => ({
          ...slot,
          rrule: rrulestr(slot.rrule),
        })),
      };

      log.info("Setting constraints...");
      setConstraints(updatedDataForRRule);
    } catch (e) {
      log.error(e);
      toast.error("Failed to fill out with AI. Please try again.", {});
    }
  };

  return (
    <div className="w-full">
      <CardHeader className="px-0 py-2">
        <CardTitle>{t("planner_ai_title")}</CardTitle>
        <CardDescription>{t("planner_ai_subtitle")}</CardDescription>
      </CardHeader>
      <Textarea
        value={aiText}
        onChange={(e) => setAiText(e.target.value)}
        className="h-52"
        placeholder={t("planner_ai_placeholder")}
      />
      <div className="flex w-full justify-end py-2">
        <Popover>
          <PopoverTrigger className="cursor-pointer text-end text-sm text-primary hover:underline">
            {t("planner_ai_help_tool")}
          </PopoverTrigger>
          <PopoverContent side="left" className="pt-2">
            <Label className="text-sm">{t("planner_ai_example_title")}</Label>
            <ol className="list-disc space-y-2 pl-2 text-sm text-contrast/80">
              <li>
                <p>{t("planner_ai_example_1")}</p>
              </li>
              <li>
                <p>{t("planner_ai_example_2")}</p>
              </li>
              <li>
                <p>{t("planner_ai_example_3")}</p>
              </li>
            </ol>
          </PopoverContent>
        </Popover>
      </div>
      <WithToolTip
        disabled={aiText.trim().length > 50}
        text={t("planner_ai_tooltip_text")}
      >
        <Button
          disabled={aiText.trim().length <= 50 || aiLoading}
          onClick={handleAIFillOut}
          className="mt-2 w-full"
          variant={"cta"}
        >
          {aiLoading ? t("general.loading") : <>{t("planner_ai_fill_out")}</>}
        </Button>
      </WithToolTip>
    </div>
  );
}
