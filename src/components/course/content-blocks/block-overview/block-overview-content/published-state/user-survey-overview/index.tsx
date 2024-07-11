import { useTranslation } from "react-i18next";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/reusable/shadcn-ui/tabs";
import type { ContentBlock } from "@/src/types/course.types";
import { SurveyAnswersOverview } from "./answers-overview";
import { SurveyUserAnswersTable } from "./user-answers";

export const SurveyOverview = ({
  block,
}: {
  block: ContentBlock<"Survey">;
}) => {
  const { t } = useTranslation("page");

  return (
    <Tabs defaultValue="overview">
      <TabsList className="w-full border border-border">
        <TabsTrigger value="overview" className="w-full">
          {t("survey_overview.tabs.overview")}
        </TabsTrigger>
        <TabsTrigger value="user-answers" className="w-full">
          {t("survey_overview.tabs.user_answers")}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="h-full w-full">
        <SurveyAnswersOverview block={block} />
      </TabsContent>
      <TabsContent value="user-answers" className="h-full w-full">
        <SurveyUserAnswersTable block={block} />
      </TabsContent>
    </Tabs>
  );
};
