import cuid from "cuid";
import { AISymbol } from "fuxam-ui";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { generateChapters } from "@/src/client-functions/client-auto-lesson";
import { fetchDropFieldDownloadUrls } from "@/src/client-functions/client-cloudflare";
import useFileDrop from "@/src/components/reusable/file-uploaders/zustand";
import Form from "@/src/components/reusable/formlayout";
import { PopoverStringInput } from "@/src/components/reusable/popover-string-input";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import SortableList from "@/src/components/reusable/sortable-list";
import useCustomFormAutoLesson from "./zustand";

export default function FormAutoLesson() {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    chapters,
    fileUrls,
    setChapters,
    setFileUrls,
    tryAgainLoading,
    setTryAgainLoading,
  } = useCustomFormAutoLesson();
  const { t } = useTranslation("page");
  const { fileLength } = useFileDrop();

  const handleGenerate = async (urls: string[]) => {
    setLoading(true);
    setTryAgainLoading(true);
    const data = await generateChapters(urls);
    setChapters(data.chapters.map((c) => ({ ...c, id: cuid() })));
    setFileUrls(data.fileUrls);
    setLoading(false);
    setTryAgainLoading(false);
  };

  useEffect(() => setChapters([]), []);

  const handleGenerateWithUrl = async () => {
    const urls = await fetchDropFieldDownloadUrls();
    handleGenerate(urls);
  };

  return (
    <>
      <Form.FullWidthItem>
        <div className="group relative flex h-[200px] w-full flex-col items-center justify-center gap-2 overflow-y-scroll rounded-lg border border-border bg-foreground text-center">
          {chapters.length === 0 || tryAgainLoading ? (
            <>
              <AISymbol state={loading ? "thinking" : "spinning"} />
              <span className="block w-96 text-sm text-muted-contrast">
                {t(
                  loading || tryAgainLoading
                    ? "auto_lesson.topic.placeholder.loading"
                    : "auto_lesson.topic.placeholder",
                )}
              </span>
              {!loading && (
                <Button
                  variant={"cta"}
                  onClick={handleGenerateWithUrl}
                  disabled={fileLength === 0}
                >
                  {t("autolesson_generate")}
                </Button>
              )}
            </>
          ) : (
            <div className="size-full">
              <SortableList
                items={chapters}
                setItems={(i) => setChapters(i)}
                renderItem={(chapter) => (
                  <div className="flex w-full items-center justify-between bg-foreground py-1 pr-2 text-start">
                    <div className="flex flex-col pr-5 text-xs">
                      {chapter.title}
                      <span className="text-xs text-muted-contrast">
                        {chapter.description}
                      </span>
                    </div>
                    <div className="flex w-10 items-center justify-end">
                      <Button
                        variant={"ghost"}
                        size={"icon"}
                        onClick={() => {
                          setChapters(
                            chapters.filter((c) => c.id !== chapter.id),
                          );
                        }}
                      >
                        <X className="size-4 text-muted-contrast" />
                      </Button>
                    </div>
                  </div>
                )}
              />
            </div>
          )}
        </div>
        {!!chapters.length && (
          <div className="flex w-full items-center">
            <PopoverStringInput
              side="top"
              actionName="add"
              withDescription
              onSubmit={(title, description) => {
                setChapters([
                  ...chapters,
                  {
                    id: Math.random().toString(36).substr(2, 9),
                    title,
                    description,
                  },
                ]);
              }}
            >
              <Button variant={"link"}>
                <Plus className="mr-1 size-4" />
                {t("add")}
              </Button>
            </PopoverStringInput>
            <Button
              onClick={() => {
                handleGenerate(fileUrls);
              }}
              variant={"link"}
              className="font-normal text-muted-contrast"
            >
              {loading && tryAgainLoading
                ? t("auto_lesson.topic.placeholder.loading")
                : t("try_again")}
            </Button>
          </div>
        )}
      </Form.FullWidthItem>
    </>
  );
}
