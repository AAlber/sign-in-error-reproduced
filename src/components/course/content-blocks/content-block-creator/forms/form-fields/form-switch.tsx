import Form from "@/src/components/reusable/formlayout";
import Switch from "@/src/components/reusable/settings-switches/switch";

type FormSwitchFieldProps = {
  fieldKey: string;
  data: any;
  field: any;
  handleInputChange: (key: string, value: any) => void;
};

const FormSwitchField = ({
  fieldKey: key,
  data,
  field,
  handleInputChange,
}: FormSwitchFieldProps) => {
  return (
    <Form.Item label={field.label} description={field.description}>
      <Switch
        checked={data ? data[key] : field.defaultValue}
        onChange={(value) => handleInputChange(key, value)}
      />
    </Form.Item>
  );
};

export default FormSwitchField;
