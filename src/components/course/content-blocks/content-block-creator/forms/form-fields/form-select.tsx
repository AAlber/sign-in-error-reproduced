import { useTranslation } from "react-i18next";
import Form from "@/src/components/reusable/formlayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/reusable/shadcn-ui/select";

type FormSelectFieldProps = {
  fieldKey: string;
  data: any;
  field: any;
  handleInputChange: (key: string, value: any) => void;
};

const FormSelectField = ({
  fieldKey: key,
  data,
  field,
  handleInputChange,
}: FormSelectFieldProps) => {
  const { t } = useTranslation("page");

  return (
    <Form.Item label={field.label} description={field.description}>
      <Select
        value={data ? data[key] : field.options[0]}
        onValueChange={(value) => handleInputChange(key, value)}
        defaultValue={field.options[0]}
      >
        <SelectTrigger className="-mr-2 h-6 justify-end border-0 bg-transparent pl-2 pr-0.5 hover:bg-accent/50">
          <SelectValue>{t(data ? data[key] : field.options[0])}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {field.options.map((option, idx) => (
            <SelectItem value={option} key={idx}>
              {t(option)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Form.Item>
  );
};

export default FormSelectField;
