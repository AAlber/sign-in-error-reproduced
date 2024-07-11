import mime from "mime";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getFileExtension } from "@/src/client-functions/client-cloud";
import useFileDrop from "@/src/components/reusable/file-uploaders/zustand";
import Form from "@/src/components/reusable/formlayout";
import Switch from "@/src/components/reusable/settings-switches/switch";
import WithToolTip from "@/src/components/reusable/with-tooltip";
import type { FileSpecs } from "@/src/types/content-block/types/specs.types";
import { supportedFileTypesForFileViewer } from "@/src/utils/utils";
import useContentBlockCreator from "../../zustand";

export default function FormFileProtectionSwitch() {
  const { setData, data } = useContentBlockCreator();
  const { uppy } = useFileDrop();
  const { t } = useTranslation("page");
  const [unsupportedFileTypes, setUnsupportedFileTypes] = useState<Set<string>>(
    new Set(),
  );
  const { fileLength } = useFileDrop();

  useEffect(() => {
    const unsupported = new Set<string>();
    uppy?.getFiles().map((file) => {
      const fileExtension = getFileExtension(file.name);
      const isFileUnsupported = !supportedFileTypesForFileViewer.includes(
        mime.getType(file.name) ?? "",
      );
      if (isFileUnsupported) {
        return unsupported.add(fileExtension ?? "none");
      }
    });
    setUnsupportedFileTypes(unsupported);
    if (unsupported.size > 0) {
      setData({
        isProtected: false,
      } satisfies Partial<FileSpecs>);
    }
  }, [fileLength]);

  return (
    <Form.Item label="protect_file" description="protect_file_description">
      <WithToolTip
        text={t("cannot_protected_unsupported_file", {
          unsupportedFileTypes: Array.from(unsupportedFileTypes).join(", "),
        })}
        disabled={unsupportedFileTypes.size === 0}
      >
        <Switch
          checked={
            unsupportedFileTypes.size > 0
              ? false
              : data
              ? data.isProtected
              : false
          }
          onChange={(value) => {
            if (unsupportedFileTypes.size > 0) return;
            setData({
              isProtected: value,
            } satisfies Partial<FileSpecs>);
          }}
        />
      </WithToolTip>
    </Form.Item>
  );
}
