import { MessageCircle } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { EmptyState } from "@/src/components/reusable/empty-state/empty-state";

/** UI to show if no channel is selected in state e.g. channel === "undefined" */
export default function NoChannelSelected() {
  const { t } = useTranslation("page");
  return (
    <div className="flex h-full w-full items-center justify-center">
      <section className="relative my-auto flex flex-col items-center px-14 py-5">
        <EmptyState
          icon={MessageCircle}
          title="no.channel.empty.title"
          description="no.channel.empty.description"
        >
          <EmptyState.Article articleId={8679706} />
        </EmptyState>
      </section>
    </div>
  );
}
