import { Wand } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStreamedObject } from "@/src/client-functions/client-ai/hooks";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/reusable/shadcn-ui/popover";
import Spinner from "@/src/components/spinner";
import api from "@/src/pages/api/api";
import { plannerFixOptions } from "@/src/types/planner/planner.types";
import usePlanner from "../zustand";
import { aiPrompt } from "./ai-prompt";
import { applyFix } from "./apply-fix";

export default function FixWarningPopover() {
  const { error, constraints, layers } = usePlanner();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const { data, isStreaming, startStream, closeStream, resetData } =
    useStreamedObject(api.getAIFixSuggestions, plannerFixOptions);

  useEffect(() => {
    if (!open) return resetData();
    startStream(aiPrompt({ layers, t, constraints, error }));
    return () => closeStream();
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="ml-2 shrink-0">
        <Button variant={"link"} className="shrink-0 text-warning-contrast">
          <Wand className="mr-1 size-4" />
          Fix
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-2 text-sm">
          <div className="text-base font-medium">
            {t("fix-warning-problem-explanation")}
          </div>
          <div className="text-muted-contrast">
            {data?.problemExplanation || "Loading..."}
          </div>
          {data?.options && (
            <div className="text-base font-medium">
              {t("fix-warning-suggested-actions")}
            </div>
          )}
          {data?.options && (
            <ul className="space-y-1">
              {data.options.map((option, index) => (
                <Button
                  disabled={isStreaming}
                  key={index}
                  onClick={() => applyFix(option, constraints, layers)}
                  className="flex w-full items-center justify-start text-start text-xs font-normal"
                >
                  {option.name}
                  {isStreaming && <Spinner className="ml-2" />}
                </Button>
              ))}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
