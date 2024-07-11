import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { LoadingErrorIndicatorProps } from "stream-chat-react";
import { log } from "@/src/utils/logger/logger";
import FuxamBotLayout from "../../../fuxam-bot-layout";

export default function ChannelLoadingErrorIndicator({
  error,
}: LoadingErrorIndicatorProps) {
  const { t } = useTranslation("page");

  useEffect(() => {
    log.info("Get stream client: channelQuery error", error);
  }, []);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <FuxamBotLayout state="error">
        <div className="space-y-4">
          <div>
            <p className="bg-gradient-to-t text-xl font-semibold leading-8 text-primary">
              {t("error_boundary_heading")}
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-contrast sm:text-4xl">
              {t("error_boundary_subheading")}
            </h1>

            <p className="text-base leading-8 text-muted-contrast">
              {t("chat.channel.error.description1")}
            </p>
          </div>
        </div>
      </FuxamBotLayout>
    </div>
  );
}
