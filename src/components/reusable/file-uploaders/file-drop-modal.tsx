import { useTranslation } from "react-i18next";
import Modal from "../modal";
import { CardDescription, CardHeader, CardTitle } from "../shadcn-ui/card";
import { FileDropField } from "./file-drop-field";
import useFileDrop from "./zustand";

// Use this if you want to use the file drop in a modal
export default function FileDropModal() {
  const { openModal, setOpenModal, uploaderData } = useFileDrop();
  const {
    onUploadFinish,
    maxFileAmount,
    minFileAmount,
    allowedFileTypes,
    maxFileSize,
    title,
    description,
    autoProceed,
    uploadPathData,
  } = uploaderData;
  const { t } = useTranslation("page");
  return (
    <Modal open={openModal} setOpen={setOpenModal} size="sm">
      <CardHeader>
        <CardTitle>{t(title ?? "file_drop_over_and_modal_title")}</CardTitle>
        <CardDescription>
          {t(description ?? "file_drop_over_and_modal_description")}
        </CardDescription>
      </CardHeader>
      <FileDropField
        onUploadFinish={onUploadFinish}
        maxFileAmount={maxFileAmount}
        minFileAmount={minFileAmount}
        allowedFileTypes={allowedFileTypes}
        maxFileSize={maxFileSize}
        autoProceed={autoProceed}
        uploadPathData={uploadPathData}
      />
    </Modal>
  );
}
