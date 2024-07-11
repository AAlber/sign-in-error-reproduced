import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import { truncate } from "@/src/client-functions/client-utils";
import AsyncTable from "@/src/components/reusable/async-table";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { initSurvey } from "@/src/components/reusable/survey-dialog/init-function";
import UserDefaultImage from "@/src/components/user-default-image";
import type { ContentBlockUserStatus } from "@/src/types/content-block/types/user-data.types";
import type { ContentBlock } from "@/src/types/course.types";
import type { SurveySpecs } from "@/src/types/survey.types";

export const SurveyUserAnswersTable = ({
  block,
}: {
  block: ContentBlock<"Survey">;
}) => {
  const { t } = useTranslation("page");
  const isAnonymous = (block.specs as SurveySpecs).isAnonymous;

  let columns: ColumnDef<ContentBlockUserStatus<"Survey">>[] = [
    {
      id: "name",
      header: t("survey_overview.table.name"),
      accessorKey: "name",
      cell: ({ row }) => (
        <div className="flex w-full items-center gap-4">
          <UserDefaultImage user={row.original} dimensions={"h-6 w-6"} />
          {truncate(row.original.name, 30)}
        </div>
      ),
    },
    {
      id: "survey",
      header: t("survey_overview.table.survey"),
      cell: ({ row }) => {
        if (!row.original.userData)
          return (
            <p className="text-muted-contrast">
              {t("survey_overview.table.not_answered")}
            </p>
          );

        const answers = row.original.userData.answers;

        return (
          <Button
            variant={"link"}
            size={"iconSm"}
            className="flex w-auto justify-start"
            onClick={() => {
              initSurvey({
                data: {
                  questions: (block.specs as unknown as SurveySpecs).questions,
                  confirmationText: "",
                  mode: "view",
                  answers: answers,
                  onFinish: () => {
                    console.log("onFinish");
                  },
                },
              });
            }}
          >
            {t("survey_overview.table.open_survey")}
          </Button>
        );
      },
    },
    {
      id: "answered_time",
      header: t("survey_overview.table.answered_time"),
      cell: ({ row }) => (
        <p className="text-sm text-muted-contrast">
          {row.original.userData?.answeredAt
            ? dayjs(row.original.userData?.answeredAt).format(
                "DD.MM.YYYY HH:mm",
              )
            : t("survey_overview.table.not_answered")}
        </p>
      ),
    },
  ];

  if (isAnonymous) {
    columns = columns.filter((column) => column.id !== "survey");
  }

  return (
    <AsyncTable<ContentBlockUserStatus<"Survey">>
      columns={columns}
      promise={() =>
        contentBlockHandler.userStatus.getForBlock<"Survey">(block.id, true)
      }
      styleSettings={{
        pagination: false,
      }}
      refreshTrigger={block.id}
    />
  );
};
