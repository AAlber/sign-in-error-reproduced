import { useTranslation } from "react-i18next";
import LanguageSelector from "./language-selector";
import LogoUploaderField from "./logo-uploader-field";
import MainDiscountCreator from "./main-subscription-discount";
import NameInput from "./name-input";
import NumberInputField from "./number-input-field";
import ThemeSelectorField from "./theme-selector-field";

interface CommonFormProps {
  name?: string;
  setName: (value: string) => void;
  language: "en" | "de";
  setLanguage: (value: "en" | "de") => void;
  aiCredits?: number;
  setAiCredits: (value?: number) => void;
  gbPerUser?: number;
  setGbPerUser: (value?: number) => void;
  baseStorageGb?: number;
  setBaseStorageGb: (value?: number) => void;
  accessPassDiscount?: number;
  setAccessPassDiscount: (value?: number) => void;
  setLogoLink: (value?: string) => void;
  discountEnabled: boolean;
  setDiscountEnabled: (value: boolean) => void;
}

export default function CommonForm({
  name,
  setName,
  language,
  setLanguage,
  aiCredits,
  setAiCredits,
  gbPerUser,
  setGbPerUser,
  baseStorageGb,
  setBaseStorageGb,
  accessPassDiscount,
  setAccessPassDiscount,
  setLogoLink,
  discountEnabled,
  setDiscountEnabled,
}: CommonFormProps) {
  const { t } = useTranslation("page");

  return (
    <>
      <NameInput name={name} setName={setName} />
      <LogoUploaderField setLogoLink={setLogoLink} />
      <ThemeSelectorField />
      <LanguageSelector className={"grid grid-cols-3 items-center gap-4"}>
        <LanguageSelector.LabelSection />
        <LanguageSelector.SelectSection
          language={language}
          setLanguage={setLanguage}
        />
      </LanguageSelector>
      <NumberInputField
        label="AI Credits"
        value={aiCredits}
        setValue={setAiCredits}
        min={1}
        max={10000000}
      />
      <NumberInputField
        label="Gigabytes Per User"
        value={gbPerUser}
        setValue={setGbPerUser}
        min={1}
        max={10000}
      />
      <NumberInputField
        label="Base Storage GB"
        value={baseStorageGb}
        setValue={setBaseStorageGb}
        min={1}
        max={5000}
      />
      <NumberInputField
        label="Access Pass Discount %"
        value={accessPassDiscount}
        setValue={setAccessPassDiscount}
        min={0}
        max={100}
      />
      <MainDiscountCreator
        discountEnabled={discountEnabled}
        setDiscountEnabled={setDiscountEnabled}
      />
    </>
  );
}
