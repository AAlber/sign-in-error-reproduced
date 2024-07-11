import { useTranslation } from "react-i18next";
import classNames from "@/src/client-functions/client-utils";
import { Input as ShadcnInput } from "./shadcn-ui/input";

type InputProps = {
  text?: string;
  setText: (text: any) => void;
  placeholder?: string;
  maxLength?: number;
  showCount?: boolean;
  number?: boolean;
  password?: boolean;
  error?: boolean;
  disabled?: boolean;
};

export default function Input({
  text,
  setText,
  placeholder = "",
  maxLength = 0,
  number = false,
  showCount = true,
  password = false,
  error = false,
  disabled = false,
}: InputProps) {
  const { t } = useTranslation("page");

  return (
    <div className="relative flex w-full items-center">
      <ShadcnInput
        name="title"
        id="title"
        type={
          number === true ? "number" : password === true ? "password" : "text"
        }
        disabled={disabled}
        maxLength={maxLength > 0 ? maxLength : undefined}
        value={text}
        onChange={(e) => {
          if (number === true) {
            if (!Number.isNaN(Number(e.target.value))) {
              setText(Number(e.target.value));
            }
          } else {
            setText(e.target.value);
          }
        }}
        autoFocus
        placeholder={t(placeholder)}
        className={classNames(
          error ? "border-destructive" : "",
          "block h-8 w-full min-w-0 flex-grow rounded-md border px-2 text-contrast",
        )}
      />
      {maxLength > 0 && showCount == true && (
        <div className="absolute right-1 top-1 flex h-6 w-8 cursor-default select-none items-center justify-center rounded-[4px] border border-border bg-background text-xs shadow-sm ring-0">
          <span className="!text-contrast">
            {maxLength - (text ? text.length : 0)}
          </span>
        </div>
      )}
    </div>
  );
}
