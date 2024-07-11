import cuid from "cuid";
import { CornerDownLeft, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { Input } from "@/src/components/reusable/shadcn-ui/input";
import useSurveyCreation from "./zustand";

const SurveyPopoverAwnsersList = () => {
  const { t } = useTranslation("page");
  const [isFocused, setIsFocused] = useState(false);
  const { answers, setAwnsers } = useSurveyCreation();

  const handleBlur = (e) => {
    const newText = e.target.value.trim();
    if (newText) {
      setAwnsers([...answers, { id: cuid(), text: newText }]);
      e.target.value = "";
      setIsFocused(false);
    }
  };

  useEffect(() => {
    //if the user press enter, add the awnser
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        const newText = e.target.value.trim();
        if (newText) {
          setAwnsers([...answers, { id: cuid(), text: newText }]);
          e.target.value = "";
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [answers, setAwnsers]);

  return (
    <div className="divide- flex w-full flex-col gap-2 divide-border rounded-md border border-border p-2">
      {answers.map((awnser) => (
        <div className="relative flex items-center" key={awnser.id}>
          <Input
            key={awnser.id}
            className="border- relative w-full rounded-md bg-transparent p-2 text-sm text-muted-contrast focus:border"
            defaultValue={awnser.text}
            onBlur={(e) => {
              const newText = e.target.value.trim();
              if (newText) {
                setAwnsers(
                  answers.map((a) =>
                    a.id === awnser.id ? { ...a, text: newText } : a,
                  ),
                );
              } else {
                setAwnsers(answers.filter((a) => a.id !== awnser.id));
              }
            }}
          />
          {answers.length > 2 && (
            <Button
              size={"iconSm"}
              variant={"ghost"}
              onClick={() =>
                setAwnsers(answers.filter((a) => a.id !== awnser.id))
              }
              className="absolute right-1"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}

      {answers.length < answers.length + 1 && (
        <Input
          className="border- relative w-full rounded-md bg-transparent p-2 text-sm text-muted-contrast focus:border"
          placeholder={t("cb.survey_table.popover.add_answer")}
          onBlur={handleBlur}
          onFocus={(e) => {
            setIsFocused(true);
          }}
        />
      )}

      {isFocused && (
        <p className="mt-2 flex items-center justify-end gap-1 text-end text-xs text-muted-contrast">
          {t("general.press")}
          <CornerDownLeft className="h-4 w-4" />
          {t("cb.survey_creation_enter_tip")}
        </p>
      )}
    </div>
  );
};

export default SurveyPopoverAwnsersList;
