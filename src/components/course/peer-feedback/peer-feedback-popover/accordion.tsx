// FeedbackAccordion.js
import React from "react";
import { Accordion } from "@/src/components/reusable/shadcn-ui/accordion";
import FeedbackAccordionItem from "./accordion-item";

const FeedbackAccordion = ({ data, t }) => {
  if (data.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <p className="text-sm text-muted-contrast">{t("no_feedback_yet")}</p>
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="h-full overflow-y-scroll">
      {data.map((feedback) => (
        <FeedbackAccordionItem key={feedback.id} feedback={feedback} t={t} />
      ))}
    </Accordion>
  );
};

export default FeedbackAccordion;
