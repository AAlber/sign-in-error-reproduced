import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { Input } from "@/src/components/reusable/shadcn-ui/input";
import { transformToEmbedNoCookieLink } from "../../../../client-functions/client-video";
import useWorkbench from "../../zustand";
import { useVideoSelector } from "./zustand";

export default function VideoSelector({ elementId, setImageSet }) {
  const { link, setLink, setOpenVideoSelector } = useVideoSelector();
  const { updateElementMetadata } = useWorkbench();
  const { t } = useTranslation("page");

  return (
    <div className="milkblur-light absolute left-5 top-5 z-10 w-[550px] overflow-hidden rounded-lg border border-border bg-background/80">
      <div className="sticky top-0 z-10">
        <div className="mx-auto border-b border-border px-2 ">
          <div className="relative flex h-10 justify-between">
            <X
              onClick={() => setOpenVideoSelector(false)}
              className="mr-2 mt-1 w-5 cursor-pointer text-muted-contrast"
            />
            <div className="flex flex-1 items-stretch justify-start">
              <div className="flex space-x-3">
                <div
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium text-contrast`}
                >
                  {t("workbench.sidebar_element_video_selector")}
                </div>
              </div>
            </div>
          </div>
        </div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setLink("");
            setImageSet(true);
            setOpenVideoSelector(false);
            const url = transformToEmbedNoCookieLink(link);
            updateElementMetadata(elementId, { videoUrl: url });
          }}
          className="flex flex-row items-center justify-center p-4"
        >
          <Input
            placeholder={t(
              "workbench.sidebar_element_video_selector_input_placeholder",
            )}
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <div className="ml-2">
            <Button
              onClick={() => {
                setLink("");
                setImageSet(true);
                setOpenVideoSelector(false);
                const url = transformToEmbedNoCookieLink(link);
                updateElementMetadata(elementId, { videoUrl: url });
              }}
            >
              {t("workbench.sidebar_element_video_selector_button")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
