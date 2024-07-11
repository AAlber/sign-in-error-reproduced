import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import AdvancedOptionReveal from "@/src/components/reusable/advanced-options-reveal";
import { AITextTransformerButton } from "@/src/components/reusable/ai-tool";
import Form from "@/src/components/reusable/formlayout";
import Input from "@/src/components/reusable/input";
import Modal from "@/src/components/reusable/modal";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/reusable/shadcn-ui/card";
import { Textarea } from "@/src/components/reusable/shadcn-ui/text-area";
import ContentBlockCustomForm from "./custom-forms/custom-form";
import ContentBlockForm from "./forms/form";
import ContentBlockCreatorPublishButton from "./publish-button";
import ContentBlockCreatorSaveAsOptions from "./save-as-options";
import { FormTimeOptions } from "./time-options";
import useContentBlockCreator from "./zustand";

export default function ContentBlockCreator() {
  const { t } = useTranslation("page");
  const {
    isOpen,
    name,
    description,
    setName,
    setDescription,
    setOpen,
    setError,
    contentBlockType,
  } = useContentBlockCreator();

  useEffect(() => {
    if (isOpen) setError("");
    else {
      setError("");
      setName("");
      setDescription("");
    }
  }, [isOpen]);

  if (!contentBlockType) return null;

  const block =
    contentBlockHandler.get.registeredContentBlockByType(contentBlockType);

  return (
    <Modal
      allowCloseOnEscapeOrClickOutside={false}
      open={isOpen}
      setOpen={setOpen}
      className="relative max-h-[800px] overflow-y-scroll"
    >
      <CardHeader className="px-0 pb-4 pt-0">
        <CardTitle>{t(block.name)}</CardTitle>
        <CardDescription>{t(block.description)}</CardDescription>
      </CardHeader>
      <Form>
        <Form.Item label="title">
          <Input
            text={name}
            setText={setName}
            maxLength={50}
            showCount
            placeholder="name"
          />
        </Form.Item>
        <Form.Item label="description" align="top">
          <div className="relative w-full">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("type_something_here")}
              className="relative max-h-52 bg-foreground"
            />
            <div className="absolute right-1 top-1">
              <AITextTransformerButton
                onCompletion={setDescription}
                text={description}
                className="text-muted-contrast"
                variant={"ghost"}
                tooltipText={"text_improver_ai"}
                disabled={!description}
              />
            </div>
          </div>
        </Form.Item>

        {block.form && <ContentBlockForm form={block.form} />}

        {!block.form && (
          <>
            <ContentBlockCustomForm />
            <AdvancedOptionReveal
              alternateText="content_block.time_options"
              className="col-span-full -mt-2"
            >
              <FormTimeOptions />
            </AdvancedOptionReveal>{" "}
          </>
        )}
        <Form.ButtonSection>
          <ContentBlockCreatorSaveAsOptions />
          <ContentBlockCreatorPublishButton />
        </Form.ButtonSection>
      </Form>
    </Modal>
  );
}
