import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import Modal from "@/src/components/reusable/modal";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import type { ContentBlock } from "@/src/types/course.types";
import type { SurveySpecs } from "@/src/types/survey.types";
import { SurveyCreationQuestionsTable } from "../../../content-block-creator/forms/custom-form-fields/form-survey/questions-table";
import useCustomFormSurvey from "../../../content-block-creator/forms/custom-form-fields/form-survey/zustand";

export const EditSurvey = ({ block }: { block: ContentBlock }) => {
  const { t } = useTranslation("page");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [blockSurvey, setBlockSurvey] = useState<ContentBlock["specs"]>(
    block.specs as SurveySpecs,
  );
  const { questions: editorQuestions } = useCustomFormSurvey();

  const getSurveyBlock = async () => {
    setLoading(true);
    await contentBlockHandler.get
      .block(block.layerId, block.id)
      .then((block) => {
        if (!block) return;
        setBlockSurvey(block.specs as SurveySpecs);
      });
    setLoading(false);
  };

  const saveSurvey = async () => {
    setLoading(true);
    await contentBlockHandler.update.block({
      id: block.id,
      specs: {
        ...block.specs,
        questions: editorQuestions,
      },
    });
    setLoading(false);
    setOpen(false);
  };

  useEffect(() => {
    getSurveyBlock();
  }, [open]);

  return (
    <>
      <Button onClick={() => setOpen(true)} disabled={loading}>
        {loading ? t("general.loading") : t("cb.survey_edit")}
      </Button>
      <Modal open={open} setOpen={setOpen}>
        <div className="flex size-full flex-col gap-2">
          <h2 className="text-lg font-bold">{t("cb.survey_edit.title")}</h2>
          <p className="text-sm text-muted-contrast">
            {t("cb.survey_table.title")}
          </p>
          <SurveyCreationQuestionsTable
            startingQuestions={blockSurvey.questions}
          />
          {editorQuestions !== blockSurvey.questions && (
            <Button
              variant={"cta"}
              className="ml-auto"
              onClick={saveSurvey}
              disabled={loading}
            >
              {loading ? t("general.loading") : t("general.save")}
            </Button>
          )}
        </div>
      </Modal>
    </>
  );
};
