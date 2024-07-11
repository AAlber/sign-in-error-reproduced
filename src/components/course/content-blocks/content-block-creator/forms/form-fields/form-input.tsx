import { useEffect, useState } from "react";
import Form from "@/src/components/reusable/formlayout";
import { Input } from "@/src/components/reusable/shadcn-ui/input";
import useContentBlockCreator from "../../zustand";

type FormInputFieldProps = {
  fieldKey: string;
  data: any;
  field: any;
  isNumber?: boolean;
  handleInputChange: (key: string, value: any) => void;
};

const FormInputField = ({
  fieldKey: key,
  data,
  field,
  isNumber,
  handleInputChange,
}: FormInputFieldProps) => {
  const { setError, isOpen } = useContentBlockCreator();
  const [input, setInput] = useState(data ? data[key] : "");

  useEffect(() => {
    setInput(data ? data[key] : "");
  }, [isOpen, data, key]);

  useEffect(() => {
    setError(field.verification(input));
    let value: string | number = input;
    if (isNumber) {
      value = value.toString().replace(/\D/g, ""); // Remove non-digit characters
      value = parseInt(value, 10);
    }
    handleInputChange(key, value);
  }, [input]);

  return (
    <Form.Item label={field.label} description={field.description}>
      <Input
        value={input}
        type={isNumber ? "number" : "text"}
        onChange={(e) => setInput(e.target.value)}
      />
    </Form.Item>
  );
};

export default FormInputField;
