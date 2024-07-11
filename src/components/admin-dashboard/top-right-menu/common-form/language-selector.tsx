import { useTranslation } from "react-i18next";
import { Label } from "../../../reusable/shadcn-ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../reusable/shadcn-ui/select";
import TruncateHover from "../../../reusable/truncate-hover";

// Main LanguageSelector component
const LanguageSelector = ({ className, children }) => {
  return <div className={className}>{children}</div>;
};

// Label Section
const LabelSection = ({ label = "language" }: { label?: string }) => {
  const { t } = useTranslation("page");
  return <Label htmlFor="type">{t(label)}</Label>;
};
LabelSection.displayName = "LabelSection";

// Select Section
const SelectSection = ({
  language,
  setLanguage,
  setLanguageChanged,
}: {
  language: Language;
  setLanguage: (lang: Language) => void;
  setLanguageChanged?: (lang: boolean) => void;
}) => {
  return (
    <div className="col-span-2">
      <Select
        defaultValue="en"
        value={language}
        onValueChange={(value: Language) => {
          setLanguage(value);
          setLanguageChanged && setLanguageChanged(true);
        }}
      >
        <SelectTrigger className="h-8 w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {["en", "de"].map((item, index) => (
              <SelectItem value={item} key={index}>
                <TruncateHover text={item} truncateAt={20} />
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
SelectSection.displayName = "SelectSection";

LanguageSelector.SelectSection = SelectSection;
LanguageSelector.LabelSection = LabelSection;
export default LanguageSelector;
