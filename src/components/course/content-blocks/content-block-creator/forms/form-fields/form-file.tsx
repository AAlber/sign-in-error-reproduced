import { useTranslation } from "react-i18next";
import { replaceVariablesInString } from "@/src/client-functions/client-utils";
import { FileDropField } from "@/src/components/reusable/file-uploaders/file-drop-field";
import Form from "@/src/components/reusable/formlayout";

type FormFileFieldProps = {
  fieldKey: string;
  data: any;
  field: any;
  handleInputChange: (key: string, value: any) => void;
};

const FormFileField = ({
  fieldKey: key,
  data,
  field,
  handleInputChange,
}: FormFileFieldProps) => {
  const { t } = useTranslation("page");
  return (
    <Form.Item
      align="top"
      label={field.label}
      description={field.description}
      extraInfo={
        field.allowedFileTypes.includes("*")
          ? ""
          : replaceVariablesInString(t("supported_file_types_x"), [
              field.allowedFileTypes.map((type: string) => t(type)).join(", "),
            ])
      }
    >
      <div className="w-full">
        <FileDropField
          allowedFileTypes={
            field.allowedFileTypes.includes("*")
              ? undefined
              : field.allowedFileTypes
          }
        />
      </div>
    </Form.Item>
  );
};

export default FormFileField;
