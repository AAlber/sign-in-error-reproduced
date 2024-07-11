import { AISymbol } from "fuxam-ui";
import { useTranslation } from "react-i18next";
import { Button } from "@/src/components/reusable/shadcn-ui/button";

export default function EmptyState({ append, onSelectTemplate }) {
  const { t } = useTranslation("page");

  return (
    <div className="relative flex h-full flex-col items-center justify-center px-4 text-center">
      <AISymbol state="spinning" className="h-8 w-8" />
      <span className="mt-1 font-medium text-contrast">
        {t("planner.title")}
      </span>
      <span className="mx-5 text-sm text-muted-contrast">
        {t("planner.description")}
      </span>
      <div className="absolute bottom-4 grid w-full grid-cols-1 gap-2 px-4">
        {new Array(2).fill(0).map((_, idx) => {
          const question = t(`planner.help.${idx + 1}`);
          return (
            <Button
              key={idx}
              className="text-xs font-normal text-muted-contrast hover:text-contrast"
              onClick={() => {
                onSelectTemplate(question);
                append({
                  content: question,
                  role: "user",
                });
              }}
            >
              {question}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
