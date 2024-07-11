import { Check, X } from "lucide-react";
import React from "react";

interface EditingOptionsProps {
  onCancel: () => void;
  onSave: () => void;
}

const EditOptions = (props: EditingOptionsProps) => {
  const { onCancel, onSave } = props;
  return (
    <div className="flex justify-end space-x-3 p-2">
      <Button onClick={onCancel}>
        <X size={18} />
      </Button>
      <Button onClick={onSave}>
        <Check size={18} />
      </Button>
    </div>
  );
};

export default EditOptions;

const Button = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className="text-muted-contrast transition-colors" {...props} />
);
