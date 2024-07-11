import type Uppy from "@uppy/core";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../shadcn-ui/button";

// Use this if you want to use the file drop in a modal
export default function UploadButton({
  uppy,
  showUploadButton = true,
}: {
  uppy: Uppy<Record<string, unknown>, Record<string, unknown>>;
  showUploadButton?: boolean;
}) {
  const { t } = useTranslation("page");
  const [enabled, setEnabled] = useState(true);
  return (
    <div className="mt-2 flex justify-end">
      {showUploadButton && (
        <Button
          variant={"cta"}
          disabled={!enabled}
          onClick={async () => {
            setEnabled(false);
            uppy.upload();
          }}
        >
          {t("drop_file_upload")}
        </Button>
      )}
    </div>
  );
}
