import { useTranslation } from "react-i18next";
import Input from "../../reusable/input";
import { OTPInputComponent } from "../../reusable/opt-input-digit-code";

export default function ConfirmationCode({
  requiredCode,
  code,
  setCode,
  confirmationCodePlaceholder,
}) {
  const { t } = useTranslation("page");
  const isNumeric = (value) => /^\d+$/.test(value);
  const isCodeNumeric = isNumeric(requiredCode);

  return (
    <div
      className={`flex ${
        isCodeNumeric
          ? "flex-row items-start gap-4 text-contrast"
          : "flex-col gap-1 text-destructive"
      } w-full`}
    >
      <div className="w-full">
        <p className="text-sm text-muted-contrast">
          {t("confirm_action.modal_title")}
        </p>

        <div className="text-s my-1">
          <span className="font-semibold">{requiredCode}</span>
        </div>

        {!isCodeNumeric && (
          <Input
            placeholder={t(
              confirmationCodePlaceholder ??
                "confirm_action.modal_input_placeholder",
            )}
            text={code}
            setText={setCode}
          />
        )}
      </div>

      {isCodeNumeric && (
        <div className="flex items-start p-2 pr-8">
          <OTPInputComponent code={code} setCode={setCode} />
        </div>
      )}
    </div>
  );
}
