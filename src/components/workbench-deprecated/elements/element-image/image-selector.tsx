import { Search, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { updateCourseStorageCategoryWithUploadResult } from "@/src/client-functions/client-cloudflare/uppy-logic";
import { searchUnsplashImages } from "@/src/client-functions/client-unsplash";
import useCourse from "@/src/components/course/zustand";
import { FileDropField } from "@/src/components/reusable/file-uploaders/file-drop-field";
import { imageFileTypes, maxFileSizes } from "@/src/utils/utils";
import useWorkbench from "../../zustand";

type Props = {
  elementId: string;
  setSelecorOpen: (data: boolean) => void;
  setImageSet: (data: boolean) => void;
};

export default function ImageSelector({
  elementId,
  setSelecorOpen,
  setImageSet,
}: Props) {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [loadedImages, setLoadedImages] = useState(false);
  const [embed, setEmbed] = useState("");
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const { updateElementMetadata, blockId } = useWorkbench();
  const { t } = useTranslation("page");
  const { course } = useCourse();
  return (
    <div className="absolute left-5 top-5 z-50 w-[550px] overflow-hidden rounded-lg border border-border bg-background">
      {/* Tabs */}
      <div className="sticky top-0 z-10">
        <div className="mx-auto border-b border-border px-2">
          <div className="relative flex h-10 justify-between">
            <X
              onClick={() => setSelecorOpen(false)}
              className="ml-1 mr-3 mt-2.5 w-5 cursor-pointer text-muted-contrast"
            />
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
                  {t("workbench.sidebar_element_image_popup_embed_link")}
                </a>
                <a
                  href="#"
                  onClick={() => setTab(2)}
                  className={`inline-flex items-center ${
                    tab === 2
                      ? "border-b border-primary text-contrast"
                      : "text-contrast hover:border-b hover:border-primary"
                  } px-1 pt-1 text-sm font-medium`}
                >
                  <Image
                    src="/images/unsplash.png"
                    width={13}
                    height={13}
                    className={`mr-2.5 dark:invert ${
                      tab !== 2 && "opacity-30"
                    }`}
                    alt="Unsplash"
                  />
                  {t("workbench.sidebar_element_image_popup_unsplash")}
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* Tab content - Upload Image */}
        {tab === 0 && (
          <div className="p-4">
            <FileDropField
              uploadPathData={{
                type: "workbench",
                blockId,
                elementId,
                layerId: course.layer_id,
              }}
              allowedFileTypes={imageFileTypes}
              sizeUpdater={updateCourseStorageCategoryWithUploadResult}
              maxFileSize={maxFileSizes.images}
              onUploadCompleted={(url: string) => {
                updateElementMetadata(elementId, { imageUrl: url });
                setImageSet(true);
                setSelecorOpen(false);
              }}
            />
          </div>
        )}
        {/* Tab content - Embed Image */}
        {tab === 1 && (
          <form
            onSubmit={() => {
              setImages([]);
              setSearch("");
              setEmbed("");
              setTab(0);
              updateElementMetadata(elementId, { imageUrl: embed });
              setImageSet(true);
              setSelecorOpen(false);
            }}
            className="flex flex-row items-center justify-center p-4"
          >
            <input
              type="text"
              className={`block h-9 w-full rounded-md border-border bg-background text-contrast shadow-sm placeholder:text-muted focus:border-primary focus:ring-primary`}
              placeholder={t(
                "workbench.sidebar_element_image_popup_embed_link_input_placeholder",
              )}
              value={embed}
              onChange={(e) => setEmbed(e.target.value)}
            />
            <button
              onClick={() => {
                setImages([]);
                setSearch("");
                setEmbed("");
                setTab(0);
                updateElementMetadata(elementId, { imageUrl: embed });
                setImageSet(true);
                setSelecorOpen(false);
              }}
              className="relative ml-2 inline-flex h-9 items-center justify-center rounded-md border border-border bg-foreground p-2 text-sm font-medium text-muted-contrast hover:bg-secondary"
            >
              {t("workbench.sidebar_element_image_popup_embed_link_button")}
            </button>
          </form>
        )}
        {/* Tab content - Unsplash Image */}
        {tab === 2 && (
          <div className="flex w-full flex-col items-center justify-center text-sm text-muted-contrast">
            <div className="flex w-full flex-row items-center justify-center p-4">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const res = await searchUnsplashImages(search);
                  setImages(res);
                  setLoadedImages(true);
                }}
                className="relative w-full rounded-md shadow-sm"
              >
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search
                    className="size-5 text-muted-contrast"
                    aria-hidden="true"
                  />
                </div>
                <input
                  type="search"
                  name="search"
                  id="search"
                  className={`block h-9 w-full rounded-md border-border bg-background pl-9 text-contrast shadow-sm placeholder:text-muted focus:border-primary focus:ring-primary`}
                  placeholder={t(
                    "workbench.sidebar_element_image_popup_unsplash_input_placeholder",
                  )}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </form>
              <button
                onClick={async () => {
                  const res = await searchUnsplashImages(search);
                  setImages(res);
                  setLoadedImages(true);
                }}
                className="relative ml-2 inline-flex h-9 items-center justify-center rounded-md border border-border bg-foreground p-2 text-sm font-medium text-muted-contrast shadow-sm hover:bg-secondary"
              >
                {t("workbench.sidebar_element_image_popup_unsplash_button")}
              </button>
            </div>
            <div className="grid w-full grid-cols-4 gap-2 px-4">
              {images.map((image, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setImages([]);
                    setSearch("");
                    setEmbed("");
                    setTab(0);
                    setLoadedImages(false);
                    updateElementMetadata(elementId, {
                      imageUrl: image.regular,
                    });
                    setImageSet(true);
                    setSelecorOpen(false);
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
    </div>
  );
}
