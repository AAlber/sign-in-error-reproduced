import cuid from "cuid";
import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { updateCourseStorageCategoryWithUploadResult } from "@/src/client-functions/client-cloudflare/uppy-logic";
import { searchUnsplashImages } from "@/src/client-functions/client-unsplash";
import useContentBlockModal from "@/src/components/course/content-blocks/content-block-creator/zustand";
import useCourse from "@/src/components/course/zustand";
import { FileDropField } from "@/src/components/reusable/file-uploaders/file-drop-field";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { Input } from "@/src/components/reusable/shadcn-ui/input";

interface Props {
  onUpload: (url: string) => void;
}

export const ImageUploader = ({ onUpload }: Props) => {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [loadedImages, setLoadedImages] = useState(false);
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const { id } = useContentBlockModal();
  const { t } = useTranslation("page");
  const { course } = useCourse();

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-background">
      <div className="mx-auto border-b border-border px-2">
        <div className="relative flex h-10 justify-between">
          <div className="flex flex-1 items-stretch justify-start">
            <div className="flex space-x-3">
              <a
                href="#"
                onClick={() => setTab(0)}
                className={`inline-flex items-center ${
                  tab === 0
                    ? "border-b border-primary text-contrast"
                    : "text-contrast hover:border-b hover:border-primary"
                } px-1 pt-1 text-sm font-medium`}
              >
                {t("workbench.sidebar_element_image_popup_upload")}
              </a>
              <a
                href="#"
                onClick={() => setTab(1)}
                className={`inline-flex items-center ${
                  tab === 1
                    ? "border-b border-primary text-contrast"
                    : "text-contrast hover:border-b hover:border-primary"
                } px-1 pt-1 text-sm font-medium`}
              >
                <Image
                  src="/images/unsplash.png"
                  width={13}
                  height={13}
                  className={`mr-2.5 dark:invert ${tab !== 2 && "opacity-30"}`}
                  alt="Unsplash"
                />
                {t("workbench.sidebar_element_image_popup_unsplash")}
              </a>
            </div>
          </div>
        </div>
      </div>
      {tab === 0 && (
        <div className="p-4">
          <FileDropField
            allowedFileTypes={["image/*"]}
            autoProceed={true}
            sizeUpdater={updateCourseStorageCategoryWithUploadResult}
            onUploadCompleted={(url: string) => {
              onUpload(url);
            }}
            uploadPathData={{
              type: "workbench",
              blockId: id,
              layerId: course?.layer_id,
              elementId: cuid(),
            }}
          />
        </div>
      )}
      {tab === 1 && (
        <div className="flex w-full flex-col items-center justify-center text-sm text-muted-contrast">
          <div className="flex w-full flex-row items-center justify-center gap-2 p-4">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const res = await searchUnsplashImages(search);
                setImages(res);
                setLoadedImages(true);
              }}
              className="relative w-full"
            >
              <Input
                type="search"
                name="search"
                id="search"
                placeholder={t(
                  "workbench.sidebar_element_image_popup_unsplash_input_placeholder",
                )}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>
            <Button
              onClick={async () => {
                const res = await searchUnsplashImages(search);
                setImages(res);
                setLoadedImages(true);
              }}
            >
              {t("workbench.sidebar_element_image_popup_unsplash_button")}
            </Button>
          </div>
          <div className="grid w-full grid-cols-4 gap-2 px-4">
            {images.map((image, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onUpload(image.full);
                }}
                className="relative h-16 w-full cursor-pointer rounded-md border border-border shadow-sm hover:opacity-80 hover:saturate-150"
              >
                <Image
                  src={image.thumb}
                  className="size-full rounded-md object-cover"
                  alt="Unsplash Image"
                  fill
                  sizes="100%"
                />
              </button>
            ))}
          </div>
          {images.length === 0 && search && loadedImages && (
            <span className="pb-5 pt-2">
              {t("workbench.sidebar_element_image_popup_no_results")}
            </span>
          )}
          {images.length > 0 && (
            <span className="py-2">
              {t("workbench.sidebar_element_image_popup_more_results")}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
