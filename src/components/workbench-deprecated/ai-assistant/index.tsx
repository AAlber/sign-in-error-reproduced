import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import classNames from "@/src/client-functions/client-utils";
import useUser from "@/src/zustand/user";
import BetaBadge from "../../reusable/badges/beta";
import { Button } from "../../reusable/shadcn-ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../reusable/shadcn-ui/popover";
import FakeAIAssistantProgressBar from "./fake-loader";
import GenerateButton from "./generate-button";
import PdfInput from "./pdf-input";
import PromptInput from "./prompt-input";
import SelectContentTypes from "./select-content-types";
import SelectLanguage from "./select-language";
import SelectPromptOrigin from "./select-prompt-origin";
import SelectSectionPage from "./select-section-page";
import { PromptOrigin, useAIAssistant } from "./zustand";

export default function AIAssistant() {
  const { promptOrigin, loading } = useAIAssistant();
  const { user } = useUser();
  const { t } = useTranslation("page");
  const [open, setOpen] = useState(false);

  if (
    user.institution?.institutionSettings.addon_artificial_intelligence ===
    false
  )
    return null;

  return (
    <Popover open={open} defaultOpen>
      <PopoverTrigger asChild>
        <div
          onClick={() => setOpen(!open)}
          className={`group absolute -bottom-[103px] right-24 flex cursor-pointer items-center gap-2 rounded-lg transition-all duration-300 ease-out ${
            open ? "bottom-6" : "hover:bottom-6"
          }`}
        >
          <Image
            className={`hover-effect h-[180px] w-[180px] object-cover ${
              open ? "flex" : "group-hover:flex"
            } ${open ? "" : "hidden"}`}
            src={"/illustrations/robot/neutral.webp"}
            width={350}
            height={350}
            priority
            alt="AI Assistant"
          />
          <Image
            className={`h-[180px] w-[180px] object-cover ${
              open ? "hidden" : "group-hover:hidden"
            } ${open ? "" : "flex"}`}
            src={"/illustrations/robot/neutral.webp"}
            width={350}
            height={350}
            priority
            alt="AI Assistant"
          />
          <Image
            className={`absolute -bottom-16 h-[180px] w-[180px] object-cover opacity-0 blur-3xl transition-all duration-200 ease-in-out ${
              open ? "opacity-100" : "group-hover:opacity-100"
            }`}
            src={"/illustrations/robot/neutral.webp"}
            width={350}
            height={350}
            priority
            alt="AI Assistant"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="-mr-5 p-0"
        side="left"
        align="end"
        style={{ width: "500px" }}
      >
        <div className="relative flex w-full flex-col items-start rounded-md dark:bg-gradient-to-tr dark:from-foreground dark:to-background">
          <Button
            onClick={() => setOpen(false)}
            className="absolute right-2 top-2"
            variant={"ghost"}
            size={"icon"}
          >
            <X size={18} />
          </Button>
          <div className="flex w-full flex-col gap-y-4 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-between">
                <h1 className="flex items-center gap-1 text-lg font-semibold leading-7 text-contrast">
                  {t("workbench_ai_assistant_title")}
                  <BetaBadge />
                </h1>
              </div>
            </div>
            <div
              className={classNames(
                loading && "pointer-events-none cursor-not-allowed opacity-60",
                "flex w-full flex-col gap-y-4",
              )}
            >
              <SelectSectionPage />
              <SelectContentTypes />
              <SelectPromptOrigin />
              {promptOrigin === PromptOrigin.TEXT && <PromptInput />}
              {promptOrigin === PromptOrigin.PDF && <PdfInput />}
            </div>
            {loading ? (
              <FakeAIAssistantProgressBar />
            ) : (
              <div className="flex items-center gap-2">
                <GenerateButton />
                <SelectLanguage />
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
