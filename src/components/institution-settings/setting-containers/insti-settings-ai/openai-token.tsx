import api from "gpt-tokenizer";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SettingsSection from "@/src/components/reusable/settings/settings-section";
import { Textarea } from "@/src/components/reusable/shadcn-ui/text-area";

const OpenAIToken = () => {
  const { t } = useTranslation("page");
  const [inputText, setInputText] = useState("");
  const [tokenLength, setTokenLength] = useState(0);

  useEffect(() => {
    const encodedTokens = api.encode(inputText);
    setTokenLength(encodedTokens.length);
  }, [inputText]);

  return (
    <SettingsSection
      title={t("openai_token_title")}
      subtitle={t("openai_token_description")}
      footerButtonDisabled={true}
      noFooter={true}
    >
      <Textarea
        placeholder={t("chat.toolbar.code.placeholder")}
        onChange={(e) => setInputText(e.currentTarget.value)}
        className="min-h-[75px] text-contrast "
      />

      <div className="mt-2 flex justify-end">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4">
          <div className="text-muted-contrast">
            {t("organization_settings.ai_characters")}{" "}
          </div>
          <span>{inputText.length}</span>
          <div className="text-muted-contrast">
            {t("organization_settings.ai_tokens")}
          </div>
          <span>{tokenLength}</span>
        </div>
      </div>
    </SettingsSection>
  );
};

export default OpenAIToken;
