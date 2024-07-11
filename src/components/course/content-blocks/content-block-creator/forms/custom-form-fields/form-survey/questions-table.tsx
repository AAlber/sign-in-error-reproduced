import type { ColumnDef } from "@tanstack/react-table";
import { List, MessageSquareDashed, TextCursorInput, X } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import AsyncTable from "@/src/components/reusable/async-table";
import { EmptyState } from "@/src/components/reusable/empty-state";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import type { SurveyQuestion } from "@/src/types/survey.types";
import CreateBlockSurveyPopover from "./create-block-survey";
import useCustomFormSurvey from "./zustand";

export const SurveyCreationQuestionsTable = ({
  startingQuestions,
}: {
  startingQuestions?: SurveyQuestion[];
}) => {
  const { t } = useTranslation("page");
  const { questions, removeQuestion, setQuestions } = useCustomFormSurvey();

  useEffect(() => {
    if (startingQuestions) {
      setQuestions(startingQuestions);
    }
  }, [startingQuestions]);

  const colums: ColumnDef<SurveyQuestion>[] = [
    {
      id: "type",
      accessorKey: "type",
      header: t("cb.survey_table.type"),
      cell: ({ row }) => {
        switch (row.original.type) {
          case "selection":
            return <List className="size-3.5" />;
          case "text":
            return <TextCursorInput className="size-3.5" />;
        }
      },
    },
    {
      id: "question",
      accessorKey: "question",
      header: t("cb.survey_table.question"),
      cell: ({ row }) => (
        <p className="text-sm text-contrast">{row.original.question}</p>
      ),
    },
    {
      id: "add_question",
      accessorKey: "add_question",
      header: () => (
        <div className="mr-2 flex items-center justify-end gap-2 text-primary">
          <CreateBlockSurveyPopover />
        </div>
      ),
      cell: ({ row }) => (
        <Button
          variant="ghost"
          className="flex w-full justify-end"
          onClick={() => removeQuestion(row.original.id)}
        >
          <X className="mr-2 size-3.5" />
        </Button>
      ),
    },
  ];

  return (
    <AsyncTable<SurveyQuestion>
      promise={async () => {
        return questions;
      }}
      data={questions}
      setData={setQuestions}
      columns={colums}
      styleSettings={{
        showSearchBar: false,
        pagination: false,
        emptyState: (
          <EmptyState
            title="survey_cb.empty_state_title"
            description="survey_cb.empty_state_description"
            icon={MessageSquareDashed}
          />
        ),
      }}
      refreshTrigger={questions.length}
    />
  );
};
